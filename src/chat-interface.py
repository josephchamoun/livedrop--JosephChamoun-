import requests
import json
import sys
from datetime import datetime

# === CONFIGURATION ===
# Update this URL to match your deployed ngrok endpoint
NGROK_URL = input("Enter your ngrok tunnel URL (e.g., https://abc123.ngrok-free.app): ").strip().rstrip('/')
CHAT_ENDPOINT = f"{NGROK_URL}/chat"
LOG_FILE = "chat_log.txt"

def log_message(role, message):
    """Save conversation turns into a log file with timestamps."""
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(f"[{datetime.now().isoformat()}] {role}: {message}\n")
    except Exception as e:
        print(f"[Warning] Could not log message: {e}")

def ask_question(question):
    """Send a question to the deployed RAG API and return formatted answer."""
    try:
        print("[Retrieving context...]")
        response = requests.post(
            CHAT_ENDPOINT, 
            json={"query": question, "top_k": 3}, 
            timeout=30,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code != 200:
            print(f"[Error] API returned status {response.status_code}: {response.text}")
            return None
        
        data = response.json()
        
        # Expected response format: {"answer": "...", "sources": [...], "confidence": "High"}
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
        print("Make sure your ngrok tunnel is active and the Flask server is running.")
        return None
    except json.JSONDecodeError as e:
        print(f"[JSON error] {e}")
        return None

def test_connection():
    """Test if the API is accessible."""
    try:
        health_url = f"{NGROK_URL}/health"
        response = requests.get(health_url, timeout=10)
        if response.status_code == 200:
            print("✓ Connection successful!")
            health_data = response.json()
            print(f"  Model loaded: {health_data.get('model_loaded', 'Unknown')}")
            print(f"  Documents: {health_data.get('num_docs', 'Unknown')}")
            return True
        else:
            print(f"✗ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Connection test failed: {e}")
        return False

def chat_loop():
    """Run the CLI chat interface."""
    print("=== Shoplite Chat Assistant ===")
    print("Testing connection...")
    
    if not test_connection():
        print("Cannot connect to the API. Please check your ngrok URL and try again.")
        return
    
    print("\nType 'exit' to quit, 'log' to view conversation history.\n")
    
    while True:
        try:
            question = input("> ").strip()
            
            if question.lower() in ["exit", "quit", "q"]:
                print("Goodbye!")
                break
                
            if question.lower() == "log":
                try:
                    with open(LOG_FILE, "r", encoding="utf-8") as f:
                        print("\n--- Conversation Log ---")
                        print(f.read())
                        print("--- End Log ---\n")
                except FileNotFoundError:
                    print("No conversation log found.\n")
                continue
            
            if not question:
                print("Please enter a question.\n")
                continue
            
            log_message("USER", question)
            print("[Calling LLM...]")
            
            result = ask_question(question)
            
            if result:
                print(f"\nAnswer: {result['answer']}")
                if result['sources']:
                    print(f"Sources: {', '.join(result['sources'])}")
                print(f"Confidence: {result['confidence']}\n")
                log_message("ASSISTANT", result['answer'])
            else:
                print("⚠️  No response received. Please try again later.\n")
                
        except KeyboardInterrupt:
            print("\nSession ended.")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")

if __name__ == "__main__":
    try:
        if not NGROK_URL:
            print("No URL provided. Exiting.")
            sys.exit(1)
        chat_loop()
    except KeyboardInterrupt:
        print("\nSession ended.")
        sys.exit(0)
