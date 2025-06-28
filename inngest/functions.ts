
import { inngest } from "./client";
import { createAgent, anthropic, gemini } from "@inngest/agent-kit";
import { db } from "../configs/db";
import { HistoryTable } from "../configs/schema";
import ImageKit from "imagekit";

// Hello World Function
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

// AI Career Chat Agent Definition
export const AiCareerChatAgent = createAgent({
  name: "AiCareerChatAgent",
  description: "An Ai Agent that answers career related questions",
  system: `You are a helpful, Professional AI career Coach Agent. Your role is to guide users with questions related to careers, including job search advice, interview preparation, resume improvement, skill development, career transitions, and industry trends. Always respond with clarity, encouragement, and actionable advice tailored to the user's needs. If the user asks something unrelated to careers (e.g., topics like health, relationships, coding help, or general trivia), gently inform them that you are a career coach and suggest a relevant career-focused question instead.`,
  model: gemini({
    model: "gemini-2.0-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
  }),
});

export const AiResumeAnalyzerAgent = createAgent({
  name: "AiResumeAnalyzerAgent",
  description: "AI Resume Analyzer Agent help to Return Report",
  system: `You are an advance AI Reumse Analyzer Agent.

  Your Taks is to evaluate a candidate's resume and return a detailed analysis in the following structured JSON schema format.

  The schema must match the layout and structure of a visual UI that includes overall scores, summary feedback, improvement tips,strengths and weekaness.
  
  INPUT: I will provide a plain text resume.
  GOAL: Output a JSON report as per the schema below.The report should reflect:

  overall_score(0-100)
  overall_feedback(short message e.g. "Excellent", "Needs Improvement")
  summary_comment(1-2 sentences evaluation summary)

  Section Scores for:
  Contact Info
  Experience
  Education
  Skills
  Each section should include:
  score (as percentage)
  Optional comment abouth that section 
  Tips for improvement (3-5 tips)
  What's Good (1-3 strengths)
  Needs improvement (1-3 weaknesses)

  Output JSON Schema:
  json
  Copy
  Edit
  {
  "overall_score": 85,
  "overall_feedback": "Excellent!",
  "summary_comment": "Your resume is strong, but there are areas to refine.",
  "sections":{
    "contact_info":{
      "score": 95,
      "comment": "Perfectly structured and complete."},
    "experience":{
      "score": 88,
      "comment": "Strong bullent points and impact".
    },
    "education":{
      "score": 70,
      "comment": "Consider adding relevant CourseWork."
    },
    "skills":{
      "score": 60,
      "comment": "Expand on specific skill proficiencies."}
    }
  },

  "tips_for_improvement":[
   "Add more numbers and metrics to yuor exxperience section to show impact.",
   "Integrate more industry-specific keywords relevant to your target roles.",
   "Start bullet points with strong action verbs to make your achievements stand out."
   ],

   "whats_good": [
    "Clean and professional formatting",
    "Clear and concise contact information",
    "Relevant work experience."
  ],

  "needs-improvement": [
    "Skills section lacks detail.",
    "Some experience bullet points could be stronger.",
    "Missing a professional summary/objective."
  ]
}`,
  model: gemini({
    model: "gemini-2.0-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
  }),
});


export const AIRoadmapGeneratorAgent = createAgent({
  name:'AIRoadmapGeneratorAgent',
  description: 'Generate Details Tree Like Flow Roadmap',
  system:`Generate a React flow tree-structured learning roadmap for user input position/skills the following format:
  vertical tree structure with meaningful x/y positions to form a flow
  - Structure should be similar to roadmap.sh layout
  - Steps should be ordered from fundamentals to advanced
  - Include branching for different specializations (if applicable)
  - Each node must have a title, short description, and learning resource link
  - Use unique IDs for all nodes and edges
  - make it more specious m=node position,
  - Response n JSON format
  {
  roadmapTitle:",
  description: <3-5 Lines>,
  duration:",
  initialNodes :[
  {
    id:'1',
    type:'turbo',
    position: {x:0, y:0},
    data:{
    title: 'Step Title',
    description: 'Short two-line explanation of what the step covers.',
    link: 'Helpful link for learning this step.'
    },
  },
  ...
  ],
  initialEdges: [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
  ...
  ];
  }
  `,
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY
  })
})

// AI Career Agent Function
export const AiCareerAgent = inngest.createFunction(
  { id: "AiCareerAgent" },
  { event: "AiCareerAgent" },
  async ({ event: careerEvent, step }) => {
    const { userInput } = careerEvent.data;
    const result = await AiCareerChatAgent.run(userInput);
    return result;
  }
);

var imagekit = new ImageKit({
  //@ts-ignore
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  //@ts-ignore
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  //@ts-ignore
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT_URL,
});

// AI Resume Agent Function (Fixing typo and variable shadowing)
export const AiResumeAgent = inngest.createFunction(
  { id: "AiResumeAgent" },
  { event: "AiResumeAgent" },
  async ({ event: resumeEvent, step }) => {
    const { recordId, base64ResumeFile, pdfText, aiAgentType,userEmail } = resumeEvent.data;

    const uploadFileUrl = await step.run("uplaodImage", async () => {
      const imageKitFile = await imagekit.upload({
        file: base64ResumeFile,
        fileName: `${Date.now()}.pdf`,
        isPublished: true,
      });
      return imageKitFile.url;
    });

    const aiResumeReport = await AiResumeAnalyzerAgent.run(pdfText);

    //@ts-ignore
    const rawContent = aiResumeReport.output[0].content;
    const rawContentJson = rawContent.replace('```json','').replace('```','');
    const parseJson = JSON.parse(rawContentJson);
    //return parseJson;

    //Save to DB
    const saveToDb = await step.run('SaveToDb', async () => {
    const result = await db.insert(HistoryTable).values({
    recordId: recordId,
    content: parseJson,
    aiAgentType: aiAgentType,
    createdAt: new Date().toISOString(),  
    userEmail: userEmail,
    metaData: uploadFileUrl,                
  });

  console.log(result);
  return parseJson;
});
    // return aiResumeReport;
  }
);


export const AIRoadmapAgent = inngest.createFunction(
  {id: 'AiRoadMapAgent'},
  { event: "AiRoadMapAgent" },
  async({event,step})=>{
    const { roadmapId,userInput,userEmail} = await event.data;

    const roadmapResult = await AIRoadmapGeneratorAgent.run("UserInput:" + userInput);
    //@ts-ignore
    const rawContent = roadmapResult.output[0].content;
    const rawContentJson = rawContent.replace('```json','').replace('```','');
    const parseJson = JSON.parse(rawContentJson);

    //Save to DB
    const saveToDb = await step.run('SaveToDb',async() =>{
      const result = await db.insert(HistoryTable).values({
        recordId: roadmapId,
        content: parseJson,
        aiAgentType: '/ai-tools/ai-roadmap-agent',
        createdAt:(new Date()).toString(),
        userEmail: userEmail,
        metaData: userInput
      });
      console.log(result);
      return parseJson;
    })
  }
)












