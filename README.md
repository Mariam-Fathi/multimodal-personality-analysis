# Automated Predictive Analysis of Personal Characteristics from Multimodal Video

![Python](https://img.shields.io/badge/Python-3.x-blue?logo=python)
![Machine Learning](https://img.shields.io/badge/Machine-Learning-orange)
![Deep Learning](https://img.shields.io/badge/Deep-Learning-red)
![Multimodal Fusion](https://img.shields.io/badge/Multimodal-Fusion-green)
![Web App](https://img.shields.io/badge/Web-Application-lightgrey)

**Multimodal Personality Prediction from Video** — Bachelor project (Computer Systems Engineering). End-to-end multimodal AI system that predicts Big Five personality traits from short candidate videos by combining computer vision (facial action units, emotional features), audio (PyAudioAnalysis), and NLP (BERT). Trained on the First Impressions V2 dataset (10K videos) with LSTNet for time-series modeling and late fusion with XGBoost, achieving MAE 0.0489. Delivered a full-stack web app (Node.js, Express, MongoDB) with secure auth, video upload pipeline, Python ML integration, and admin dashboard; results visualized as radar charts.

## 🎯 Project Overview

Engineered an end-to-end multimodal AI system predicting Big Five personality traits from short video clips, integrating computer vision, audio processing, and NLP. The system processes the First Impressions V2 dataset (10K videos) using facial action units, emotional features, PyAudioAnalysis, and BERT embeddings. LSTNet architectures handle time-series modeling with late fusion via XGBoost for personality trait prediction.

**Key Features:**
- **Multimodal Processing:** Video, audio, and text from a single input; fusion for robust Big Five prediction.
- **ML Pipeline:** LSTNet for time-series modeling; late fusion with XGBoost; VGG-Face, OpenFace, PyAudioAnalysis, BERT.
- **Web Application:** Full-stack app (Node.js, Express, MongoDB)—secure auth, upload pipeline, admin dashboard, radar-chart visualization.
- **Data:** First Impressions V2 (10K videos); imbalanced regression addressed via oversampling.

## 📈 Performance Results (Mean Absolute Error)

| Modality | Openness | Conscientiousness | Extraversion | Agreeableness | Neuroticism | Average |
|:--------:|:--------:|:-----------------:|:------------:|:-------------:|:-----------:|:-------:|
| **Video** | 0.0064 | 0.0074 | 0.0080 | 0.0059 | 0.0078 | 0.0071 |
| **Audio** | 0.0016 | 0.0013 | 0.0013 | 0.0012 | 0.0012 | 0.0013 |
| **Text** | 0.0461 | 0.0511 | 0.0477 | 0.0460 | 0.0530 | 0.0489 |
| **Fusion** | **0.1230** | **0.1339** | **0.1333** | **0.1227** | **0.1222** | **0.1270** |

## 🚀 Setup

1. **Install dependencies:** `npm install`
2. **Environment:** Copy `.env.example` to `.env` and set:
   - `MONGODB_URI` – MongoDB connection string
   - `SESSION_SECRET` – long random string for session signing
   - `JWT_KEY` – long random string for JWT signing
3. **Python (for personality prediction):** The app calls `ML/Traits-Prediction.py` with the uploaded video path. A stub is included that returns placeholder scores. Replace it with your full ML pipeline. Ensure `python` (or `python3`) is on PATH, or set `PYTHON_PATH` in `.env`.
4. **Run:** `npm run dev` or `npm start`
