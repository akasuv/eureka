// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import { Archivo_Black } from "next/font/google";

const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400" });

export default function Eureka() {
  const [isClient, setIsClient] = useState(false);

  const listRef = useRef<HTMLUListElement>(null);
  const [history] = useState([]);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [raw, setRaw] = useState([]);
  const [resume, setResume] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    (async () => {
      while (true) {
        setIsLoading(true);
        const res = await fetch("/api/msg").then((res) => res.json());

        setIsLoading(false);
        setMsgs(
          res.message.body.data.map((item) => {
            return item.content[0].text.value;
          })
        );

        setResume(res.resume);

        await new Promise((r) => setTimeout(r, 3000));
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let msg = input;
    setInput("");
    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({ message: msg }),
    }).then((res) => res.json());

    setIsLoading(false);

    console.log(res);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const update = () => {
    fetch("https://nexrzogynhdfajvkxsjn.supabase.co/rest/v1/resumes", {
      method: "POST",
      headers: {
        apiKey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5leHJ6b2d5bmhkZmFqdmt4c2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5NjA1OTYsImV4cCI6MjAxNTUzNjU5Nn0.OhkifXW-ewSRIOs4unVeqv9dHGLxWFqzXEANofUyM10",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5leHJ6b2d5bmhkZmFqdmt4c2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5NjA1OTYsImV4cCI6MjAxNTUzNjU5Nn0.OhkifXW-ewSRIOs4unVeqv9dHGLxWFqzXEANofUyM10",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "from js",
      }),
    });
  };

  return isClient ? (
    <div className="max-h-[100vh] overflow-hidden flex">
      <div className="max-h-[90vh] grow md:py-16 flex flex-col items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full px-4 md:px-8 flex flex-col items-center justify-center gap-2"
        >
          <h1
            className={
              "text-3xl mb-4 text-pink-600 font-black " + archivoBlack.className
            }
          >
            Remake
          </h1>
          <input
            className="w-full max-w-3xl border border-gray-200 rounded mb-8 shadow-md p-2 dark:text-black focus:outline-none p-4 rounded-md"
            value={input}
            placeholder="Type something..."
            onChange={handleInputChange}
          />
          <button
            className="bg-black px-4 py-2 rounded text-white hover:bg-pink-600"
            type="submit"
          >
            Submit
          </button>
        </form>
        <p className="text-pink-600 font-black min-h-[32px] h-[32px]  w-full p-8">
          {isLoading ? "Loading..." : " "}
        </p>
        <ul
          ref={listRef}
          className={
            "mt-8 h-[calc(100vh - 100px)] md:max-h-[800px] overflow-scroll list-none md:w-[800px] mx-auto flex flex-col gap-y-4 px-4 md:px-8 pb-8 w-full"
          }
        >
          {msgs.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>
      <div className="w-1/2 grow h-[90vh] mr-8 mt-8 prose p-4 border border-black border-2">
        {resume ? (
          <>
            {/* <p>{JSON.stringify(resume)}</p> */}
            <h1>{resume.name}</h1>
            <p>{resume.email}</p>
            <p>{resume.degree}</p>
            <p>{resume.major}</p>
            {resume.experiences.map((exp, idx) => (
              <div key={idx}>
                <h3>{exp.company}</h3>
                <p>{exp.date}</p>
                <p>{exp.title}</p>
                <p>{exp.description}</p>
              </div>
            ))}
          </>
        ) : null}
      </div>
    </div>
  ) : null;
}
