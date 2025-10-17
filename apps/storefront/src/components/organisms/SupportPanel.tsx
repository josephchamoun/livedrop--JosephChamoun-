import { useState } from "react";
import axios from "axios";
import Card from "../atoms/Card";
import ChatInput from "../molecules/ChatInput";

export default function SupportPanel() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<
    { text: string; variant?: "user" | "support" }[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Your deployed AI assistant endpoint
  const LLM_URL = "https://a6d54209809a.ngrok-free.app/chat";

  const handleSubmit = async () => {
    if (!query.trim()) return;

    const userMessage = query.trim();
    setResponses((prev) => [...prev, { text: userMessage, variant: "user" }]);
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.post(LLM_URL, {
        query: userMessage,
      });

      // Handle different possible response formats
      const answerText =
        res.data.answer ||
        res.data.response ||
        res.data.text ||
        "No response received.";

      setResponses((prev) => [
        ...prev,
        { text: answerText, variant: "support" },
      ]);
    } catch (err) {
      console.error("Error calling AI:", err);
      setResponses((prev) => [
        ...prev,
        { text: "⚠️ Error connecting to AI assistant.", variant: "support" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Support Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-blue-700 transition"
        >
          💬 Support
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-end">
          <div className="w-80 bg-white h-full p-4 shadow-xl flex flex-col z-50">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Ask Support</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-4">
              {responses.map((r, idx) => (
                <Card key={idx} variant={r.variant}>
                  {r.text}
                </Card>
              ))}

              {loading && (
                <Card variant="support">
                  <span className="text-gray-400 italic">
                    Assistant typing...
                  </span>
                </Card>
              )}
            </div>

            {/* Input */}
            <ChatInput
              value={query}
              onChange={setQuery}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </>
  );
}
