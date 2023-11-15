import OpenAI from "openai";

export const revalidate = 0;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: Request) {
  const message = await openai.beta.threads.messages.list(
    "thread_SD9RS1gHTT07EIOjHv12uCdp"
  );
  let resume;

  //@ts-ignore
  const target = message.data.find((msg) => msg.content[0].text.annotations[0]);

  if (target) {
    const response = await openai.files
      //@ts-ignore
      .content(target?.content[0].text.annotations[0].file_path.file_id)
      .then((res) => res.json());

    resume = response;
  }

  //@ts-ignore
  return Response.json({ message, resume: resume });
}
