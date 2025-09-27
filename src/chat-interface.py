import requests
import json
import sys
from datetime import datetime

# === CONFIGURATION ===
NGROK_URL = "https://fe7cf0441b10.ngrok-free.app/query"  
LOG_FILE = "chat_log.txt"

def log_message(role, message):
    """Save conversation turns into a log file with timestamps."""
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"[{datetime.now().isoformat()}] {role}: {message}\n")

def ask_question(question):
    """Send a question to the deployed RAG API and return formatted answer."""
    try:
        print("[Retrieving context...]")
        response = requests.post(NGROK_URL, json={"query": question}, timeout=30)

        if response.status_code != 200:
            print(f"[Error] API returned status {response.status_code}")
            return None

        data = response.json()

        # expected response format: { "answer": "...", "sources": [...], "confidence": "High" }
        answer = data.get("answer", "No answer provided.")
        sources = data.get("sources", [])
        confidence = data.get("confidence", "Unknown")

        return {
            "answer": answer,
            "sources": sources,
            "confidence": confidence
        }

    except requests.exceptions.RequestException as e:
        print(f"[Connection error] {e}")
        return None

def chat_loop():
    """Run the CLI chat interface."""
    print("=== Shoplite Chat Assistant ===")
    print("Type 'exit' to quit.\n")

    while True:
        question = input("> ")

        if question.lower() in ["exit", "quit"]:
            print("Goodbye!")
            break

        log_message("USER", question)

        print("[Calling LLM...]")
        result = ask_question(question)

        if result:
            print("\nAnswer:", result["answer"])
            if result["sources"]:
                print("Sources:", ", ".join(result["sources"]))
            print("Confidence:", result["confidence"], "\n")

            log_message("ASSISTANT", result["answer"])
        else:
            print("⚠️ No response. Please try again later.\n")

if __name__ == "__main__":
    try:
        chat_loop()
    except KeyboardInterrupt:
        print("\nSession ended.")
        sys.exit(0)

