from io import BytesIO

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

app = FastAPI(title="PedalScan prototype API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Local prototype only; restrict before deployment.
    allow_methods=["POST"],
    allow_headers=["*"],
)

MAX_IMAGE_BYTES = 8 * 1024 * 1024


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/identify")
async def identify_pedal(file: UploadFile = File(...)):
    if file.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(status_code=415, detail="Upload a JPEG, PNG, or WebP image.")

    contents = await file.read(MAX_IMAGE_BYTES + 1)
    if len(contents) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image must be 8 MB or smaller.")

    try:
        with Image.open(BytesIO(contents)) as image:
            image.verify()
    except (UnidentifiedImageError, OSError, ValueError):
        raise HTTPException(status_code=400, detail="The uploaded file is not a valid image.")

    return {
        "status": "demo",
        "message": "Image received. Pedal recognition and pricing are not implemented yet.",
    }
