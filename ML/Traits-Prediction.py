#!/usr/bin/env python3
"""
Personality traits prediction from video.
Uses fusion regressors (XGBoost) in ML/models; optional LSTNet + scalers when available.
Output format expected by Node backend: "TraitName Value: <number>" per line.
"""
import sys
import os
import pickle
import numpy as np

# Fusion regressor filenames (batch_size=128 from Fusion2)
FUSION_SUFFIX = "XGBoost_128"
TRAIT_KEYS = ("ext", "agr", "con", "neu", "ope")
# Output order for backend (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism)
OUTPUT_ORDER = (
    ("Openness", "ope"),
    ("Conscientiousness", "con"),
    ("Extraversion", "ext"),
    ("Agreeableness", "agr"),
    ("Neuroticism", "neu"),
)


def get_models_dir(project_dir: str) -> str:
    ml_models = os.path.join(project_dir, "ML", "models")
    if os.path.isdir(ml_models):
        return ml_models
    # Allow project_dir to be the app root (parent of ML)
    parent = os.path.dirname(project_dir)
    if os.path.basename(project_dir) == "ML":
        return os.path.join(project_dir, "models")
    return ml_models


def load_fusion_models(models_dir: str):
    """Load 5 XGBoost fusion regressors. Returns dict trait_key -> model."""
    regressors = {}
    for key in TRAIT_KEYS:
        path = os.path.join(models_dir, f"{key}_{FUSION_SUFFIX}.pkl")
        if not os.path.isfile(path):
            raise FileNotFoundError(f"Fusion model not found: {path}")
        with open(path, "rb") as f:
            regressors[key] = pickle.load(f)
    return regressors


def load_fusion_scaler(models_dir: str):
    """Load optional MinMaxScaler for fusion input. Returns None if missing."""
    path = os.path.join(models_dir, "fusion_scaler.pkl")
    if not os.path.isfile(path):
        return None
    with open(path, "rb") as f:
        return pickle.load(f)


def build_fusion_input_placeholder():
    """
    Fusion input per trait is (1, 3): [video_pred, voice_pred, text_pred] for that trait.
    Without LSTNet/feature extraction we use neutral 0.5 for all.
    """
    return np.array([[0.5, 0.5, 0.5]], dtype=np.float32)


def predict_traits(regressors, fusion_scaler, fusion_input_per_trait=None):
    """
    fusion_input_per_trait: dict trait_key -> (1, 3) array, or None to use placeholder.
    Returns dict trait_key -> float in [0, 1].
    """
    if fusion_input_per_trait is None:
        fusion_input_per_trait = {k: build_fusion_input_placeholder() for k in TRAIT_KEYS}
    out = {}
    for key in TRAIT_KEYS:
        x = fusion_input_per_trait[key]
        if fusion_scaler is not None:
            x = fusion_scaler.transform(x)
        pred = regressors[key].predict(x)[0]
        pred = float(np.clip(pred, 0.0, 1.0))
        out[key] = pred
    return out


def main():
    if len(sys.argv) < 3:
        print("Usage: Traits-Prediction.py <project_directory> <video_path>", file=sys.stderr)
        sys.exit(1)

    project_dir = sys.argv[1]
    video_path = sys.argv[2]

    if not os.path.isfile(video_path):
        print(f"Error: Video file not found: {video_path}", file=sys.stderr)
        sys.exit(1)

    models_dir = get_models_dir(project_dir)
    if not os.path.isdir(models_dir):
        print(f"Error: Models directory not found: {models_dir}", file=sys.stderr)
        sys.exit(1)

    try:
        regressors = load_fusion_models(models_dir)
        fusion_scaler = load_fusion_scaler(models_dir)
    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

    # TODO: when LSTNet weights + feature extractors exist, run:
    #   video_feat [1,450,35], audio_feat [1,306,34], text_feat [1,42,768]
    #   -> LSTNet -> (p_video, p_voice, p_text) each (1,5) -> fusion_input_per_trait
    # For now: fusion-only with placeholder input so the app runs end-to-end.
    fusion_input_per_trait = None

    traits = predict_traits(regressors, fusion_scaler, fusion_input_per_trait)

    # Scale to 0–100 for radar chart; backend accepts any float.
    for display_name, key in OUTPUT_ORDER:
        value = traits[key] * 100.0
        print(f"{display_name} Value: {value}")


if __name__ == "__main__":
    main()
