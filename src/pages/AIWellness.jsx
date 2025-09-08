import React from "react";
import sparkles from "../assets/images/sparkles.png";
import { RiAttachment2 } from "react-icons/ri";
import { LuSend } from "react-icons/lu";

const AIWellness = () => {
  const prompts = [
    "I’m feeling overwhelmed, any quick tips?",
    "What’s a mindfulness tip I can try this morning?",
    "What should I avoid before bed for better sleep?",
    "How can I manage stress at work today?",
    "Give me one mindful break idea for the afternoon.",
    "Tips for staying focused during long hours?",
  ];

  return (
    <div className="flex flex-col gap-6 justify-center items-center min-h-screen bg-gray-50 pb-20 px-4">
      {/* Prompt Section */}
      <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl w-full text-center border border-blue-300">
        <div className="flex justify-end pb-2">
          <img className="w-12 md:w-20" src={sparkles} alt="" />
        </div>

        {/* Header */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
          Good afternoon,{" "}
          <span className="font-light italic text-teal-500">
            what’s on your mind?
          </span>
        </h2>

        {/* Subheading */}
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Choose a prompt below or write your own to start chatting.
        </p>

        {/* Prompt Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {prompts.map((prompt, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-3 text-gray-700 text-sm hover:shadow-md hover:border-blue-400 cursor-pointer transition"
            >
              {prompt}
            </div>
          ))}
        </div>

        {/* Refresh Link */}
        <button className="mt-4 text-teal-600 font-medium hover:underline">
          ↻ Refresh prompts
        </button>
      </div>

      {/* Input Section */}
      <article className="gap-4 border rounded-xl p-4 flex flex-col w-full max-w-3xl bg-white shadow-sm">
        {/* Top row: Input */}
        <section className="flex items-center gap-3">
          <div>
            <img className="w-4 md:w-5" src={sparkles} alt="" />
          </div>
          <input
            type="text"
            placeholder="Ask a question or make a request"
            className="flex-1 outline-none border-none text-gray-700 placeholder-gray-400 text-sm bg-transparent"
          />
        </section>

        {/* Bottom row: Actions */}
        <section className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex gap-2 items-center text-gray-600 cursor-pointer hover:text-teal-600">
            <RiAttachment2 />
            <span className="text-sm font-medium">Attach</span>
          </div>
          <button className="flex gap-2 items-center bg-[#4444B3] text-white px-4 py-2 rounded-full text-sm hover:bg-[#3a3a9e] transition">
            <LuSend />
            <span className="font-medium">Send</span>
          </button>
        </section>
      </article>
    </div>
  );
};

export default AIWellness;
