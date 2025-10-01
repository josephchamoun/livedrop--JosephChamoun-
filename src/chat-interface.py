# /src/chat-interface.py

import requests
import json
import os

def main():
    print("=== Shoplite Chat Interface ===")
    print("Type 'exit' to quit.\n")

    # Get ngrok URL (you'll paste it from Colab when API is running)
    base_url = input("Enter your ngrok base URL (e.g., https://xxxx.ngrok-free.app): ").strip()

    if not base_url.startswith("http"):
        print("❌ Invalid URL. Please include 'http://' or 'https://'")
        return

    chat_url = f"{base_url}/chat"
    health_url = f"{base_url}/health"

    # Health check
    try:
        r = requests.get(health_url, timeout=10)
        if r.status_code == 200:
            print("✅ Connected to LLM backend!\n")
        else:
            print(f"⚠️ Backend health check failed: {r.text}")
    except Exception as e:
        print(f"❌ Could not reach backend: {e}")
        return

    # Start chat loop
    conversation_log = []
    while True:
        user_input = input("> You: ").strip()
        if user_input.lower() in ["exit", "quit"]:
            print("👋 Goodbye!")
            break

        try:
            payload = {"question": user_input}
            response = requests.post(chat_url, json=payload, timeout=60)

            if response.status_code == 200:
                data = response.json()
                answer = data.get("answer", "No answer returned.")
                sources = data.get("sources", [])
                confidence = data.get("confidence", "Unknown")

                print("\n--- Response ---")
                print(f"Answer: {answer}")
                if sources:
                    print("Sources:", ", ".join(sources))
                print(f"Confidence: {confidence}\n")

                # Save conversation log
                conversation_log.append({
                    "question": user_input,
                    "answer": answer,
                    "sources": sources,
                    "confidence": confidence
                })

            else:
                print(f"⚠️ Error {response.status_code}: {response.text}")

        except Exception as e:
            print(f"❌ Request failed: {e}")

    # Save chat log to file
    log_path = "conversation_log.json"
    with open(log_path, "w", encoding="utf-8") as f:
        json.dump(conversation_log, f, indent=2)
    print(f"💾 Conversation saved to {log_path}")

if __name__ == "__main__":
    main()
