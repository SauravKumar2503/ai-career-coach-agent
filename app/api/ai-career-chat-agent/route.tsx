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





// Latest working code

import { inngest } from "@/inngest/client";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  const { userInput } = await req.json();

  const resultIds = await inngest.send({
    name: "AiCareerAgent",
    data: {
      userInput: userInput,
    },
  });

  const runId = resultIds?.ids[0];

  let runStatus, output;
  let timeout = 30000; // Max 30 seconds
  const startTime = Date.now();

  while (true) {
    runStatus = await getRuns(runId);

    const completed = runStatus?.data?.[0]?.status === "Completed";
    const hasOutput = runStatus?.data?.[0]?.output;

    if (completed && hasOutput) {
      output = runStatus.data[0].output;
      break;
    }

    if (Date.now() - startTime > timeout) {
      return NextResponse.json({ error: "Timeout: No response from agent." }, { status: 500 });
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return NextResponse.json(output); // return the final assistant message here
}

export async function getRuns(runId: string) {
  const result = await axios.get(
    `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,
    {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },
    }
  );
  return result.data;
}
