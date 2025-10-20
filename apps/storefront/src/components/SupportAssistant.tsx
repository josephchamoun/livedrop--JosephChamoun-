/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useEffect } from "react";
import { sendAssistantMessage } from "../lib/api";

interface Message {
  id: string;
  text: string;
  role: "user" | "assistant";
  intent?: string;
  citations?: string[];
  timestamp: Date;
  functionsCalled?: string[];
}

export default function SupportAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Welcome message on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          text: "Hi! I'm Luna, your support specialist at Shoplite. I can help you with orders, products, and store policies. What can I do for you today?",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    }
  }, [open, messages.length]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await sendAssistantMessage(input.trim(), {});

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        role: "assistant",
        intent: response.intent,
        citations: response.citations,
        functionsCalled: response.functionsCalled,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("Assistant error:", err);
      setError(err.message || "Failed to get response");

      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble right now. Please try again in a moment.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <>
      {/* Floating Support Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50 hover:bg-blue-700 transition-all hover:scale-110 flex items-center gap-2"
          aria-label="Open support chat"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span className="font-semibold">Support</span>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <h2 className="text-lg font-bold">Luna</h2>
                  <p className="text-xs opacity-90">Support Specialist</p>
                </div>
              </div>
              <div className="flex gap-2">
                {messages.length > 1 && (
                  <button
                    onClick={clearChat}
                    className="text-white hover:bg-blue-800 p-2 rounded transition"
                    title="Clear chat"
                  >
                    🗑️
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="text-white hover:bg-blue-800 p-2 rounded transition"
                  aria-label="Close chat"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 text-sm text-red-700">
                <div className="flex justify-between items-center">
                  <span>⚠️ {error}</span>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800 shadow-sm border border-gray-200"
                    }`}
                  >
                    {/* Message Text */}
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>

                    {/* Metadata */}
                    <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                      <span>
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {msg.role === "assistant" && msg.intent && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {msg.intent}
                        </span>
                      )}
                    </div>

                    {/* Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Sources:</p>
                        <div className="flex flex-wrap gap-1">
                          {msg.citations.map((citation, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded"
                            >
                              {citation}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Function Calls */}
                    {msg.functionsCalled && msg.functionsCalled.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="opacity-75">
                          🔧 {msg.functionsCalled.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-lg p-3 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        Luna is typing...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {loading ? "..." : "Send"}
                </button>
              </form>

              {/* Quick Actions */}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setInput("What is your return policy?")}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition"
                  disabled={loading}
                >
                  📦 Return Policy
                </button>
                <button
                  onClick={() => setInput("Track my order")}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition"
                  disabled={loading}
                >
                  📍 Track Order
                </button>
                <button
                  onClick={() => setInput("Show me laptops")}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition"
                  disabled={loading}
                >
                  💻 Browse Products
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
