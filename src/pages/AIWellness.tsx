import React, { useState } from "react";
import sparkles from "../assets/images/sparkles.png";
import {
  Paperclip,
  Send,
  Sparkles,
  Bot,
  MessageCircle,
  RefreshCw,
} from "lucide-react";

const AIWellness: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const prompts = [
    "I'm feeling overwhelmed, any quick tips?",
    "What's a mindfulness tip I can try this morning?",
    "What should I avoid before bed for better sleep?",
    "How can I manage stress at work today?",
    "Give me one mindful break idea for the afternoon.",
    "Tips for staying focused during long hours?",
  ];

  const handlePromptClick = (prompt) => {
    setSelectedPrompt(prompt);
    setUserInput(prompt);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      setIsLoading(true);
      // Simulate AI response
      setTimeout(() => {
        setIsLoading(false);
        setUserInput("");
        setSelectedPrompt("");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-indigo-100 p-4 rounded-2xl">
              <Bot className="w-12 h-12 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Your Personal Wellness Assistant
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Powered by AI to provide personalized wellness guidance, mindfulness
            tips, and health recommendations tailored just for you.
          </p>
        </div>

        {/* Prompt Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              What's on your mind today?
            </h2>
            <p className="text-gray-600">
              Choose a prompt below or write your own to start chatting with
              your AI wellness assistant.
            </p>
          </div>

          {/* Prompt Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {prompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className={`p-4 rounded-xl text-left transition-all duration-200 ${
                  selectedPrompt === prompt
                    ? "bg-indigo-100 border-2 border-indigo-500 text-indigo-700"
                    : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium">{prompt}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center">
            <button className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center gap-2 mx-auto">
              <RefreshCw size={16} />
              Refresh prompts
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <input
                type="text"
                placeholder="Ask a question or make a request..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 text-lg border-none outline-none placeholder-gray-400"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <Paperclip size={20} />
                <span className="font-medium">Attach File</span>
              </button>

              <button
                type="submit"
                disabled={!userInput.trim() || isLoading}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              AI-Powered
            </h3>
            <p className="text-gray-600">
              Advanced AI technology provides personalized wellness
              recommendations.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              24/7 Available
            </h3>
            <p className="text-gray-600">
              Get instant wellness guidance whenever you need it, day or night.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Personalized
            </h3>
            <p className="text-gray-600">
              Tailored advice based on your specific needs and wellness goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIWellness;
