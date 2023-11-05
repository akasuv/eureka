"use client";

import { useState, useRef, useEffect } from "react";
import { useChat, Message } from "ai/react";
import { Archivo_Black } from "next/font/google";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400" });

const Message = ({ message }: { message: Message }) => {
  return (
    <li
      id={message.role}
      className={clsx({
        "font-black": message.role === "user",
        "text-sm": message.role !== "user",
        "bg-grey-100 shadow-md shadow-neutral-100 rounded p-4 border border-neutral-50":
          message.role !== "user",
        "mt-8": message.role === "user",
      })}
    >
      <div
        className={clsx({
          "flex flex-col gap-2 justify-between": true,
          "mb-4": message.role !== "user",
        })}
      >
        {message.role !== "user" && (
          <div className="flex items-center gap-x-1">
            <FontAwesomeIcon
              icon={faRobot}
              size="xs"
              className="pb-[2px] text-gray-500"
            />
            <p className="font-normal text-xs text-gray-500">GPT-4</p>
          </div>
        )}
        {message.createdAt && (
          <p
            className={clsx({
              "text-xs text-gray-500 font-normal": true,
            })}
          >
            {new Date(message.createdAt).toLocaleString()}
          </p>
        )}
      </div>
      <Markdown
        className={clsx({ prose: message.role !== "user" })}
        components={{
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, "")}
                style={dracula}
                language={match[1]}
                PreTag="div"
                className="not-prose"
              />
            ) : (
              <code {...rest} className="bg-gray-200 not-prose px-2 rounded">
                {children}
              </code>
            );
          },
        }}
      >
        {message.content}
      </Markdown>
    </li>
  );
};

const getMessagesFromLocalStorage = (): Array<{
  role: "user" | "assistant";
  content: string;
  id: string;
  createdAt: Date;
}> => {
  if (typeof window === "undefined") {
    return [];
  }
  const messages = localStorage.getItem("messages");

  return messages ? JSON.parse(messages) : [];
};

export default function Eureka() {
  const [isClient, setIsClient] = useState(false);

  const listRef = useRef<HTMLUListElement>(null);
  const [history] = useState(getMessagesFromLocalStorage());
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onFinish: (messages) => {
      localStorage.setItem(
        "messages",
        JSON.stringify([
          ...history,
          {
            role: "user",
            content: input,
            createdAt: new Date().toISOString(),
            id: crypto.randomUUID(),
          },
          messages,
        ]),
      );
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      listRef.current?.scroll({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 200);
  }, [messages]);

  return isClient ? (
    <div className="max-h-screen w-full py-12 md:py-24 flex flex-col items-center overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="w-full px-4 md:px-8 flex flex-col items-center justify-center gap-2"
      >
        <h1 className={"text-3xl mb-4 " + archivoBlack.className}>Eureka!</h1>
        <input
          className="w-full max-w-3xl border border-gray-300 rounded mb-8 shadow-md p-2 dark:text-black focus:outline-none p-4 rounded-md"
          value={input}
          placeholder="Type something..."
          onChange={handleInputChange}
        />
      </form>
      <ul
        ref={listRef}
        className={
          "h-[calc(100vh - 100px)] md:max-h-[800px] overflow-scroll list-none md:w-[800px] mx-auto flex flex-col gap-y-4 px-4 md:px-8 pb-8 w-full"
        }
      >
        {history.map((item) => (
          <Message message={item} />
        ))}
        {messages.map((item, i) => (
          <Message message={item} />
        ))}
      </ul>
    </div>
  ) : null;
}
