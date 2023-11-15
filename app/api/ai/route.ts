import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { message } = await req.json();

  const res = await openai.beta.threads.messages.create(
    "thread_SD9RS1gHTT07EIOjHv12uCdp",
    {
      role: "user",
      content: message,
    }
  );

  const run = await openai.beta.threads.runs.create(
    "thread_SD9RS1gHTT07EIOjHv12uCdp",
    {
      assistant_id: "asst_6Yd5xOe3HgMGYThsznTougMF",
      // instructions:
      //   "create a resume.json for user based on the information: name, email, degree and major, if any of the information is missing, abort and ask user for the missing information",
      tools: [{ type: "code_interpreter" }],
    }
  );

  return Response.json(run);
}
