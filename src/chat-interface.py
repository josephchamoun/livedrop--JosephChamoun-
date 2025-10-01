# /src/chat-interface.py
import requests
import time

LOG_FILE = "chat_log.txt"


def log(message: str):
    """Append message to log file with timestamp"""
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {message}\n")


def ask_llm(api_url: str, question: str):
    """Send question to the LLM API and return response"""
    try:
        print("[Retrieving context...]")
        res = requests.post(api_url, json={"question": question}, timeout=30)

        if res.status_code != 200:
            return f"Error: API returned {res.status_code} - {res.text}"

        data = res.json()
        answer = data.get("answer", "No answer")
        sources = ", ".join(data.get("sources", [])) or "N/A"
        confidence = data.get("confidence", "Unknown")

        formatted = (
            f"Answer: {answer}\n"
            f"Sources: {sources}\n"
            f"Confidence: {confidence}"
        )

        # Log Q&A
        log(f"Q: {question}")
        log(f"A: {answer} | Sources: {sources} | Confidence: {confidence}\n")

        return formatted

    except requests.exceptions.RequestException as e:
        return f"Connection error: {e}"


def main():
    print("=== LLM Chat Interface ===")
    api_url = input("Enter your LLM API URL (e.g., https://xxxx-5000.ngrok-free.app/chat): ").strip()
    if not api_url:
        print("No URL entered. Exiting.")
        return

    print("Type 'exit' to quit.\n")

    while True:
        try:
            question = input("> ").strip()
            if not question:
                continue
            if question.lower() in ("exit", "quit"):
                print("Goodbye!")
                break

            print("[Calling LLM...]")
            response = ask_llm(api_url, question)
            print(response)
            print()

        except KeyboardInterrupt:
            print("\nGoodbye!")
            break


if __name__ == "__main__":
    main()
