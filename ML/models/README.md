# ML models directory

**Inventory (from Drive):** Fusion regressors only — no LSTNet `.pth`/`.pt` or `fusion_scaler.pkl` / `text_scaler.pkl` yet. The app runs in **fusion-only** mode with placeholder modality inputs until those are added.

## What’s here (from Drive)

- **Fusion regressors (used)**  
  - `ext_XGBoost_128.pkl`, `agr_XGBoost_128.pkl`, `con_XGBoost_128.pkl`, `neu_XGBoost_128.pkl`, `ope_XGBoost_128.pkl`  
  - `Traits-Prediction.py` loads these and runs fusion-only inference (placeholder modality inputs until LSTNet + extractors are added).

## Optional (add when available)

- **fusion_scaler.pkl** – `sklearn.preprocessing.MinMaxScaler` fit on validation fusion features in Fusion2. If present, fusion input is scaled before the regressors.
- **text_scaler.pkl** – MinMaxScaler for text embeddings (for when text feature extraction is wired in).
- **LSTNet weights** (PyTorch):  
  - Video: e.g. `all_traits_video_LSTNet-E75_LR0.001.pth` (or same architecture).  
  - Voice: e.g. `voice_model_50_epochs.pt`.  
  - Text: e.g. `text_model_50_epochs.pt`.  
  Once these and feature extractors (video AUs, audio, BERT text) are in place, `Traits-Prediction.py` can be extended to run the full pipeline.
