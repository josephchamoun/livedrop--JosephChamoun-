/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { sendAssistantMessage } from "../../lib/api";
import Card from "../atoms/Card";
import ChatInput from "../molecules/ChatInput";

interface Response {
  qid?: string;
  text: string;
  variant?: "user" | "support";
  intent?: string;
  citations?: string[];
  functionsCalled?: string[];
}

export default function SupportPanel() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [responses]);

  // Welcome message on first open
  useEffect(() => {
    if (open && responses.length === 0) {
      setResponses([
        {
          text: "Hi! I'm Luna, your support specialist. How can I help you today?",
          variant: "support",
        },
      ]);
    }
  }, [open, responses.length]);

  const handleSubmit = async () => {
    if (!query.trim() || loading) return;

    const userQuery = query.trim();

    // Add user message
    setResponses((prev) => [...prev, { text: userQuery, variant: "user" }]);
    setQuery("");
    setLoading(true);

    try {
      // Call AI backend
      const response = await sendAssistantMessage(userQuery, {});

      // Add AI response
      setResponses((prev) => [
        ...prev,
        {
          text: response.text,
          variant: "support",
          intent: response.intent,
          citations: response.citations,
          functionsCalled: response.functionsCalled,
          qid: response.citations?.[0], // Use first citation as qid if available
        },
      ]);
    } catch (error: any) {
      console.error("Assistant error:", error);

      // Add error message
      setResponses((prev) => [
        ...prev,
        {
          text: "I'm having trouble right now. Please try again in a moment.",
          variant: "support",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Support button: only show when panel is closed */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-blue-700 transition"
        >
          Support
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-end">
          <div className="w-80 bg-white h-full p-4 shadow-xl flex flex-col z-50">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-bold">Luna - Support</h2>
                <p className="text-xs text-gray-500">AI Assistant</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4">
              {responses.map((r, idx) => (
                <div key={idx}>
                  <Card variant={r.variant}>
                    {r.qid ? `[${r.qid}] ${r.text}` : r.text}
                  </Card>

                  {/* Show intent and function calls for debugging */}
                  {r.variant === "support" &&
                    (r.intent || r.functionsCalled) && (
                      <div className="text-xs text-gray-400 mt-1 px-2">
                        {r.intent && (
                          <span className="mr-2">Intent: {r.intent}</span>
                        )}
                        {r.functionsCalled && r.functionsCalled.length > 0 && (
                          <span>🔧 {r.functionsCalled.join(", ")}</span>
                        )}
                      </div>
                    )}
                </div>
              ))}

              {loading && (
                <Card variant="support">
                  <div className="flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                  </div>
                </Card>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="mb-2 flex flex-wrap gap-2">
              <button
                onClick={() => setQuery("What is your return policy?")}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                disabled={loading}
              >
                📦 Return Policy
              </button>
              <button
                onClick={() => setQuery("Track my order")}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                disabled={loading}
              >
                📍 Track Order
              </button>
            </div>

            {/* Input */}
            <ChatInput
              value={query}
              onChange={setQuery}
              onSubmit={handleSubmit}
              disabled={loading}
            />
          </div>
        </div>
      )}
    </>
  );
}
