import { useState } from "react";
import { findAnswer } from "../../assistant/engine";
import Card from "../atoms/Card";
import ChatInput from "../molecules/ChatInput";

export default function SupportPanel() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState<
    { qid?: string; text: string; variant?: "user" | "support" }[]
  >([]);

  const handleSubmit = () => {
    if (!query.trim()) return;

    const answer = findAnswer(query.trim());
    setResponses([
      ...responses,
      { text: query, variant: "user" },
      { text: answer.text, qid: answer.qid, variant: "support" },
    ]);
    setQuery("");
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
              <h2 className="text-lg font-bold">Ask Support</h2>
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
                <Card key={idx} variant={r.variant}>
                  {r.qid ? `[${r.qid}] ${r.text}` : r.text}
                </Card>
              ))}
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
