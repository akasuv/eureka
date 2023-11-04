"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { Archivo_Black } from "next/font/google";

const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400" });

const getMessagesFromLocalStorage = (): Array<{
  role: string;
  content: string;
}> => {
  const messages = localStorage.getItem("messages");

  return messages ? JSON.parse(messages) : [];
};

export default function SloganGenerator() {
  const listRef = useRef<HTMLUListElement>(null);
  const [history] = useState(getMessagesFromLocalStorage());
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onFinish: (messages) => {
      localStorage.setItem(
        "messages",
        JSON.stringify([
          ...history,
          { role: "user", content: input },
          messages,
        ]),
      );
    },
  });

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current?.scrollHeight);
  }, [messages]);

  return (
    <div className="max-h-screen w-full py-12 md:py-24 flex flex-col items-center overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="w-full px-4 md:px-8 flex flex-col items-center justify-center gap-2"
      >
        <h1 className={"text-3xl mb-4 " + archivoBlack.className}>Eureka!</h1>
        <input
          className="w-full max-w-xl border border-gray-300 rounded mb-8 shadow-md p-2 dark:text-black focus:outline-none p-4 rounded-md"
          value={input}
          placeholder="Wondering..."
          onChange={handleInputChange}
        />
      </form>
      <ul
        ref={listRef}
        className="h-[calc(100vh - 100px)] md:max-h-[800px] overflow-scroll list-none md:w-[800px] mx-auto flex flex-col gap-y-4 px-4 md:px-8"
      >
        {history.map((item, i) => (
          <li id={item.role} key={i}>
            <div className={item.role === "user" ? "font-black" : "text-sm"}>
              {item.content}
            </div>
          </li>
        ))}
        {messages.map((item, i) => (
          <li key={i}>
            <div className={item.role === "user" ? "font-black" : "text-sm"}>
              {item.content}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
