import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";


export async function POST(req:NextRequest){
  const {roadmapId,userInput} = await req.json();
  const user = await currentUser();
  const resultIds = await inngest.send({
    name: "AiRoadMapAgent",
    data: {
      userInput,
      roadmapId:roadmapId,
      userEmail: user?.primaryEmailAddress?.emailAddress
    },
  });

  const runId = resultIds?.ids?.[0];

  let runStatus;
  //User polling to check Run Status
  while (true) {
    runStatus = await getRuns(runId);
    if (runStatus?.data?.[0]?.status === "Completed") break;

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return NextResponse.json(runStatus.data?.[0].output?.output[0]);
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




