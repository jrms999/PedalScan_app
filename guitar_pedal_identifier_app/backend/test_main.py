"""Contract tests for the upload demo; no recognition accuracy is claimed."""
from io import BytesIO

from fastapi.testclient import TestClient
from PIL import Image

from main import app

client = TestClient(app)


def image_bytes():
    buffer = BytesIO()
    Image.new("RGB", (10, 10), "blue").save(buffer, format="PNG")
    return buffer.getvalue()


def test_health_and_demo_contract():
    assert client.get("/health").json() == {"status": "ok"}
    result = client.post("/identify", files={"file": ("pedal.png", image_bytes(), "image/png")})
    assert result.status_code == 200
    assert result.json()["status"] == "demo"
    assert "not implemented" in result.json()["message"]
    assert "estimated_value" not in result.json()


def test_missing_wrong_type_and_broken_image():
    assert client.post("/identify").status_code == 422
    assert client.post("/identify", files={"file": ("x.txt", b"text", "text/plain")}).status_code == 415
    assert client.post("/identify", files={"file": ("x.png", b"not a png", "image/png")}).status_code == 400


def test_file_size_limit():
    result = client.post("/identify", files={"file": ("x.png", b"x" * (8 * 1024 * 1024 + 1), "image/png")})
    assert result.status_code == 413
