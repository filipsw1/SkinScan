from pathlib import Path

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf

from app.preprocess import preprocess_image

app = FastAPI(title="SkinScan API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = Path(__file__).parent / "model" / "cnn_model_combined.keras"
model = tf.keras.models.load_model(MODEL_PATH)

GATEKEEPER_PATH = Path(__file__).parent / "model" / "gatekeeper_model.keras"
gatekeeper_model = tf.keras.models.load_model(GATEKEEPER_PATH)

THRESHOLD = 0.148  # kalibrerad i training.ipynb för 90% recall på malign klass

def get_risk_tier(probability: float) -> dict:
    if probability < 0.10:
        return {"tier": "low", "label": "Låg risk"}
    elif probability < 0.30:
        return {"tier": "consider", "label": "Överväg läkarbedömning"}
    elif probability < 0.60:
        return {"tier": "recommend", "label": "Rekommenderar läkarbedömning"}
    else:
        return {"tier": "urgent", "label": "Uppsök läkare snarast"}

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Filen måste vara en bild.")

    image_bytes = await file.read()

    try:
        img_array = preprocess_image(image_bytes)
    except Exception:
        raise HTTPException(status_code=400, detail="Kunde inte läsa bilden. Kontrollera filformatet.")

    gate_probability = float(gatekeeper_model.predict(img_array, verbose=0)[0][0])

    if gate_probability < 0.5:
        return {
            "probability": None,
            "flagged": None,
            "out_of_distribution": True,
            "message": "Bilden kunde inte identifieras som en hudlesion. Kontrollera att bilden visar ett tydligt närbild på huden och försök igen.",
            "disclaimer": "Detta är ett utbildningsprojekt, inte ett diagnosverktyg."
        }

    probability = float(model.predict(img_array, verbose=0)[0][0])
    tier = get_risk_tier(probability)

    return {
        "probability": round(probability, 4),
        "tier": tier["tier"],
        "tier_label": tier["label"],
        "disclaimer": "Detta är ett utbildningsprojekt, inte ett diagnosverktyg. Uppsök alltid läkare vid oro, oavsett resultat."
    }