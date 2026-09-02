from pathlib import Path

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import joblib
import numpy as np

from app.preprocess import preprocess_image

app = FastAPI(title="SkinScan API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = Path(__file__).parent / "model" / "skin_cnn_final.keras"
model = tf.keras.models.load_model(MODEL_PATH)

THRESHOLD = 0.148  # kalibrerad i training.ipynb för 90% recall på malign klass

feature_extractor = tf.keras.models.Model(
    inputs=model.input,
    outputs=model.get_layer('embedding_layer').output
)

scaler = joblib.load(Path(__file__).parent / "model" / "embedding_scaler.pkl")
knn_ood_model = joblib.load(Path(__file__).parent / "model" / "knn_ood_model.pkl")
ood_threshold_knn = joblib.load(Path(__file__).parent / "model" / "ood_threshold_knn.pkl")

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

    embedding = feature_extractor.predict(img_array, verbose=0)
    embedding_scaled = scaler.transform(embedding)
    distances, _ = knn_ood_model.kneighbors(embedding_scaled)
    avg_distance = distances.mean()

    if avg_distance > ood_threshold_knn:
        return {
            "probability": None,
            "flagged": None,
            "out_of_distribution": True,
            "message": "Bilden kunde inte identifieras som en hudlesion med tillräcklig säkerhet. Kontrollera att bilden visar ett tydligt närbild på huden och försök igen.",
            "disclaimer": "Detta är ett utbildningsprojekt, inte ett diagnosverktyg. Denna kontroll är en bästa-möjliga-ansträngning och fångar inte alla orelaterade bilder."
        }

    probability = float(model.predict(img_array, verbose=0)[0][0])

    return {
        "probability": round(probability, 4),
        "flagged": probability >= THRESHOLD,
        "threshold": THRESHOLD,
        "disclaimer": "Detta är ett utbildningsprojekt, inte ett diagnosverktyg. Uppsök alltid läkare vid oro."
    }