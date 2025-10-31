import json
import os
import sys
import requests

ORCH = os.getenv("BUDDYDOC_ORCHESTRATION_URL", "http://127.0.0.1:8000")

def run():
    payload = {"messages": [{"text": "Hello from smoke test"}]}
    url = ORCH.rstrip('/') + '/api/v1/orchestrate'
    print(f"POST {url}")
    # Include orchestration secret header when present in environment
    orch_secret = os.getenv("BUDDYDOC_ORCH_SECRET")
    headers = {}
    if orch_secret:
        headers["Authorization"] = f"Bearer {orch_secret}"
    r = requests.post(url, json=payload, headers=headers or None, timeout=10)
    try:
        r.raise_for_status()
    except Exception as e:
        print(f"Request failed: {e}")
        print(r.status_code, r.text)
        sys.exit(2)
    print(json.dumps(r.json(), indent=2))

if __name__ == '__main__':
    run()
