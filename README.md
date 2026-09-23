# SkinScan

An educational tool that screens photos of skin lesions for signs of concern, built as a large individual project covering the full pipeline: data preparation, unsupervised and supervised learning, deep learning, model evaluation, and a live, deployed application.

**This is not a diagnostic tool.** It is a student project. Always see a doctor about a real skin concern, regardless of what this tool shows.

## Live demo

- Frontend: [skin-scan-mocha.vercel.app](https://skin-scan-mocha.vercel.app)
- Backend API docs: [skinscan-ofrl.onrender.com/docs](https://skinscan-ofrl.onrender.com/docs)

The backend runs on a free instance and may take 30 to 60 seconds to wake up on the first request after a period of inactivity.

## What it does

A user uploads a photo of a skin lesion, guided by an in-app photo guide, and the image passes through two models in sequence:

1. **A gatekeeper model** checks whether the image actually shows skin at all, and rejects anything else (a screenshot, a photo of a person, an unrelated object) before any diagnosis is attempted.
2. **A cancer classification model** estimates the probability that the lesion is malignant, and maps that probability onto one of four risk levels, calibrated against real test data rather than a single arbitrary cutoff.

## Key results

- Trained on 12,313 images combined from two datasets: HAM10000 (dermatoscopic images) and PAD-UFES-20 (real smartphone photos, biopsy-confirmed cancer cases), the second added specifically to close a domain gap discovered by testing the first model against real photographs.
- PR-AUC 0.704 overall on held-out test data, 0.797 on the smartphone-photo subset specifically.
- 100% recall on a blind, ten-image validation run through the live application, images the model never saw during training and that were not pre-screened before testing.
- Two model-improvement attempts (class weighting, partial fine-tuning) were tested and rejected based on measured results, documented honestly in the training notebook rather than left out.

## Tech stack

| | |
|---|---|
| Modeling | Python, TensorFlow / Keras, scikit-learn, EfficientNetB0 (transfer learning) |
| Backend | FastAPI, Docker |
| Frontend | React, Vite |
| Hosting | Render (backend), Vercel (frontend) |

## Project structure

```
SkinScan/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app, /predict endpoint
│   │   ├── preprocess.py     # shared image preprocessing
│   │   └── model/            # trained .keras model files
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   └── src/
│       ├── pages/            # ToolPage, LesionTypesPage, AboutPage
│       ├── App.jsx
│       └── index.css
└── notebooks/
    └── training.ipynb        # full data prep, modeling, and evaluation
```

## Running it locally

**Backend**
```bash
cd backend
python -m venv venv
source venv/Scripts/activate   # Windows Git Bash; use venv/bin/activate on Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

The frontend defaults to `http://localhost:8000` for the API in development. To point it at a different backend, set `VITE_API_URL` in a `frontend/.env.local` file.

## Datasets

- **HAM10000**: Tschandl, P., Rosendahl, C. & Kittler, H. The HAM10000 dataset, a large collection of multi-source dermatoscopic images of common pigmented skin lesions. *Sci Data* 5, 180161 (2018).
- **PAD-UFES-20**: Pacheco, A.G.C. et al. PAD-UFES-20: A skin lesion dataset composed of patient data and clinical images collected from smartphones. *Data in Brief* 32, 106221 (2020).

## Known limitations

- HAM10000 is collected primarily from Austrian and Australian patients, a known skew toward lighter skin tones.
- The gatekeeper model is a best-effort check, not a guarantee, and can be fooled by unrelated images that happen to share visual texture with skin.
- The four risk-level thresholds were calibrated against the model's first version, before the second dataset was added, and have not been separately recalibrated against the final combined model.


