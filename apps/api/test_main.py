from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_comic_scope():
    response = client.get("/api/capabilities")
    assert response.status_code == 200
    payload = response.json()
    assert payload["product"] == "static-comic-image-only"
    assert payload["video"] is False
    assert "character-processing-adapter" in payload["planned"]
