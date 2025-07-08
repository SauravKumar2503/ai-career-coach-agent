// import { NextRequest } from "next/server";
// import {WebPDFLoader} from "@langchain/community/document_loaders/web/pdf";
// import { inngest } from "@/inngest/client";
// import axios from "axios";
// import { NextResponse } from "next/server";
// import { currentUser } from "@clerk/nextjs/server";

// export async function POST(req:NextRequest) { 
//   const FormData= await req.formData();
//   const resumeFile:any = FormData.get('resumeFile');
//   const recordId = FormData.get('recordId');
//   const user = await currentUser();

//   const loader = new WebPDFLoader(resumeFile);
//   const docs = await loader.load();
//   console.log(docs[0]) // Raw Pdf Text

//   const arrayBuffer = await resumeFile.arrayBuffer();
//   const base64 = Buffer.from(arrayBuffer).toString('base64');

//   const resultIds = await inngest.send({
//     name: "AiResumeAgent",
//     data: {
//       recordId: recordId,
//       base64ResumeFile: base64,
//       pdfText: docs[0]?.pageContent,
//       aiAgentType: '/ai-tools/ai-resume-analyzer',
//       userEmail: user?.primaryEmailAddress?.emailAddress
//     },
//   });

//   const runId = resultIds?.ids?.[0];

//   let runStatus;
//   while (true) {
//     runStatus = await getRuns(runId);
//     if (runStatus?.data?.[0]?.status === "Completed") break;

//     await new Promise((resolve) => setTimeout(resolve, 500));
//   }

//   return NextResponse.json(runStatus.data?.[0].output?.output[0]);
  
// }

// export async function getRuns(runId: string) {
//   const host = process.env.INNGEST_SERVER_HOST;
//   const key = process.env.INNGEST_SIGNING_KEY;

//   if (!host || !key) {
//     throw new Error("Missing INNGEST_SERVER_HOST or INNGEST_SIGNING_KEY");
//   }

//   const url = `${host}/v1/events/${runId}/runs`; 

//   const result = await axios.get(url, {
//     headers: {
//       Authorization: `Bearer ${key}`,
//     },
//   });

//   return result.data;
// }






import { NextRequest, NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { inngest } from "@/inngest/client";
import axios from "axios";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resumeFile: any = formData.get('resumeFile');
    const recordId = formData.get('recordId');
    const user = await currentUser();

    if (!resumeFile || !recordId || !user) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Extract raw text from PDF
    const loader = new WebPDFLoader(resumeFile);
    const docs = await loader.load();

    // Convert file to base64
    const arrayBuffer = await resumeFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // Send to Inngest AI agent
    const resultIds = await inngest.send({
      name: "AiResumeAgent",
      data: {
        recordId: recordId,
        base64ResumeFile: base64,
        pdfText: docs[0]?.pageContent,
        aiAgentType: '/ai-tools/ai-resume-analyzer',
        userEmail: user?.primaryEmailAddress?.emailAddress,
      },
    });

    const runId = resultIds?.ids?.[0];

    // Polling Inngest run until completed
    let runStatus;
    while (true) {
      runStatus = await getRuns(runId);
      if (runStatus?.data?.[0]?.status === "Completed") break;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Clean and return serializable output only
    const rawOutput = runStatus.data?.[0]?.output?.output?.[0] || {};

    const cleanOutput = {
      message: rawOutput?.message || null,
      summary: rawOutput?.summary || null,
      suggestions: rawOutput?.suggestions || null,
    };

    return NextResponse.json(cleanOutput);
  } catch (error) {
    console.error("Resume Analysis Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function getRuns(runId: string) {
  const host = process.env.INNGEST_SERVER_HOST;
  const key = process.env.INNGEST_SIGNING_KEY;

  if (!host || !key) {
    throw new Error("Missing INNGEST_SERVER_HOST or INNGEST_SIGNING_KEY");
  }

  const url = `${host}/v1/events/${runId}/runs`;

  const result = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${key}`,
    },
  });

  return result.data;
}









