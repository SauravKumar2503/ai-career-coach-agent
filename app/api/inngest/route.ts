import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { AiCareerAgent, helloWorld,AiResumeAgent, AIRoadmapAgent } from "@/inngest/functions";

export const { GET, POST, PUT} = serve({
  client: inngest,
  functions: [
    // your functions will be passed here later
    AiCareerAgent,
    AiResumeAgent,
    AIRoadmapAgent,
  ],
})