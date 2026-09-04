import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets.js";
import moment from "moment";
import Markdown from "react-markdown";
import Prism from "prismjs";
import LoadingPlaceholder from "./loadingPlaceholder";

const Message = ({ message }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  return (
    <div>
      {message.role === "user" ? (
        <div className="flex items-start justify-end my-4 gap-2">
          <div className="flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md max-w-2xl">
            <p className="text-sm dark:text-primary">{message.content}</p>
            <span className="text-xs text-gray-400 dark:text-[#B1A6C0] self-end">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
          <img
            src={assets.user_icon}
            alt="user"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      ) : (
        <div className="flex items-start gap-2 my-4">
          {/* Assistant Avatar with Fallback */}
          <div className="w-8 h-8 rounded-full bg-[#6d28d9] flex items-center justify-center text-white text-xs font-bold shrink-0">
            AI
          </div>

          <div className="inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md">
            {message.isImage ? (
              <div className="relative min-w-[280px] min-h-[200px] flex items-center justify-center">
                {!isLoaded && <LoadingPlaceholder />}
                <img
                  src={message.content}
                  alt="AI Generated"
                  onLoad={() => setIsLoaded(true)}
                  className={`w-full max-w-md mt-2 rounded-md object-cover shadow-sm transition-opacity duration-300 ${
                    isLoaded ? "opacity-100 block" : "opacity-0 absolute"
                  }`}
                />
              </div>
            ) : (
              <div className="text-sm dark:text-primary reset-tw">
                <Markdown>{message.content}</Markdown>
              </div>
            )}
            <span className="text-xs text-gray-400 dark:text-[#B1A6C0] self-end">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;