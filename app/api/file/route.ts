import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { message } = await req.json();

  const res = await openai.beta.threads.messages.create(
    "thread_rkHvEWnlhi57BPpukj2GKVT0",
    {
      role: "user",
      content: message,
    }
  );

  const run = await openai.beta.threads.runs.create(
    "thread_rkHvEWnlhi57BPpukj2GKVT0",
    {
      assistant_id: "asst_Idonuaihckdyp5UjF9pgjsrD",
      instructions: "Please address the user as S.",
    }
  );

  return Response.json(run);
}
