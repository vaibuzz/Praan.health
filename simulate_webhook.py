"""
Simulate an incoming WhatsApp message from the user to our local webhook.
"""
import urllib.request
import urllib.parse
import json

def test_webhook():
    # The URL of your LOCAL running FastAPI backend
    url = "http://localhost:8000/twilio_webhook"
    
    # Twilio sends data as form-encoded
    payload = {
        "From": "whatsapp:+919970263372",
        "Body": "Hi Praan Health! I'm Vaibhav Sunil Patil and I just signed up for a free assessment."
    }
    
    data = urllib.parse.urlencode(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data)
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')
    
    print("Pretending to be WhatsApp and sending 'Hi' to local backend...")
    
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Server response status: {response.status}")
            if response.status == 200:
                print("Webhook triggered successfully! Check your phone for the Welcome Template!")
    except Exception as e:
        print(f"Could not reach server: {e}")
        print("Make sure 'uvicorn app.main:app --reload' is running in another terminal!")

if __name__ == "__main__":
    test_webhook()
