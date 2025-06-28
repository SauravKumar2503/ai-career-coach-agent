// import { inngest } from "@/inngest/client";
// import axios from "axios";
// import { NextResponse } from "next/server";
// import { AiCareerAgent } from "@/inngest/functions";

// export async function POST(req:any){
//   const {userInput}=await req.json();

//   const resultIds = await inngest.send({
//     name: "AiCareerAgent",
//     data: {
//       userInput: userInput,
//     }
//   });
//   const runId = resultIds?.ids[0];

//   let runStatus;
//   while(true){
//     runStatus = await getRuns(runId);
//     if(runStatus?.data[0]?.status==='Completed')
//       break;

//     await new Promise(resolve => setTimeout(resolve,500))
//   }

//   return NextResponse.json(runStatus)
// }

// export async function getRuns(runId:string){
//   const result = await axios.get(process.env.INNGEST_SERVER_HOST+'/v1/events/'+{runId}+'/runs',{
//     headers:{
//       Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`
//     }
//   })
//   return result.data
// }

//This code is giving error in vercel deployment with export async function getruns


// import { inngest } from "@/inngest/client";
// import axios from "axios";
// import { NextResponse } from "next/server";
// import { AiCareerAgent } from "@/inngest/functions";

// export async function POST(req: any) {
//   const { userInput } = await req.json();

//   const resultIds = await inngest.send({
//     name: "AiCareerAgent",
//     data: {
//       userInput,
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








// This code is add to deploy on vercel  

import { inngest } from "@/inngest/client";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userInput } = await req.json();

  const resultIds = await inngest.send({
    name: "AiCareerAgent",
    data: {
      userInput,
    },
  });

  const runId = resultIds?.ids?.[0];

  let runStatus;

  while (true) {
    runStatus = await getRunStatus(runId);
    if (runStatus?.data?.[0]?.status === "Completed") break;

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return NextResponse.json(runStatus.data?.[0].output?.output[0]);
}

// ✅ This helper function is now private (NOT exported)
async function getRunStatus(runId: string) {
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
