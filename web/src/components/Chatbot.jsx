"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import useHandleStreamResponse from "@/utils/useHandleStreamResponse";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! 👋 I'm here to help you with any questions about NextGen Summit 2026. Ask me about registration, event details, partnerships, or anything else!",
    },
  ]);
  const [input, setInput] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const handleFinish = useCallback((message) => {
    setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    setStreamingMessage("");
    setIsLoading(false);
  }, []);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: handleFinish,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const systemPrompt = {
        role: "system",
        content: `You are a helpful assistant for NextGen Summit 2026, an event organized by The Tribe Africa in Abuja, FCT, Nigeria.

Event Details:
- Date: June 15-17, 2026
- Location: Abuja, FCT, Nigeria
- Organizer: The Tribe Africa (founded 2020)
- Founder: Hamilton Gabriel
- Board Chair: Dr. Dayo Benjaims-Laniyi

What the summit offers:
- Business & Career School: Skills training in technical, digital, and soft skills
- Job Creation Tracker: Monitoring employment opportunities
- Africa-In-Focus: High-impact stakeholder engagement
- Leadership training and entrepreneurship support
- Networking with industry leaders
- Free entry for participants

Partnership Tiers:
- Platinum: ₦5M (prime booth, speaking slot, 10 tickets, VIP access)
- Gold: ₦3M (premium booth, panel discussion, 6 tickets)
- Silver: ₦1.5M (standard booth, 4 tickets)
- Bronze: ₦750K (small booth, 2 tickets)

Mission: Closing gaps in youth unemployment through strategic programs and partnerships.
Vision: Every young African has access to meaningful employment.

Be friendly, concise, and helpful. Guide users to register at /register or become partners at /partner.`,
      };

      const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [systemPrompt, ...messages, userMessage],
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      handleStreamResponse(response);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error. Please try again or contact us directly.",
        },
      ]);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-600 to-orange-500 text-white p-4 rounded-full shadow-2xl hover:from-orange-700 hover:to-orange-600 transition transform hover:scale-110 z-50"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-orange-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="https://ucarecdn.com/5944ac84-70ce-4865-82bc-bb93f5345c5e/-/format/auto/"
                alt="The Tribe Africa"
                className="h-10 w-auto"
              />
              <div>
                <h3 className="font-bold">NextGen Summit Chat</h3>
                <p className="text-xs text-orange-100">Ask me anything!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    message.role === "user"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {streamingMessage && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-4 py-2 rounded-2xl bg-gray-100 text-gray-800">
                  <p className="text-sm whitespace-pre-wrap">
                    {streamingMessage}
                  </p>
                </div>
              </div>
            )}

            {isLoading && !streamingMessage && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-gray-200"
          >
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
