import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: Request) {
  // const run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  // return Response.json(run);
}
