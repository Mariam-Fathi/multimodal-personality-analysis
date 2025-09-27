# Automated Predictive Analysis of Personal Characteristics from Multimodal Video

![Python](https://img.shields.io/badge/Python-3.x-blue?logo=python)
![Machine Learning](https://img.shields.io/badge/Machine-Learning-orange)
![Deep Learning](https://img.shields.io/badge/Deep-Learning-red)
![Multimodal Fusion](https://img.shields.io/badge/Multimodal-Fusion-green)
![Web App](https://img.shields.io/badge/Web-Application-lightgrey)

This repository contains the code and documentation for our Bachelor's graduation project in Computer Systems Engineering. The project aims to automate the analysis of a job candidate's personality traits (based on the Big Five model: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism) by processing short self-presentation videos using multimodal deep learning techniques.

## 🎯 Project Overview

Employers often face the challenge of efficiently screening candidates. This system streamlines the pre-employment process by automatically predicting a candidate's personality scores from a short video. It extracts and analyzes visual (facial expressions, action units), auditory (voice prosody), and textual (speech content) cues, then fuses these modalities to generate a final, robust prediction.

**Key Features:**
- **Multimodal Processing:** Independently processes video, audio, and text from a single video input.
- **Advanced ML Models:** Implements and compares models like LSTNet, TCN, MLP, XGBoost, and ensemble methods.
- **Feature Engineering:** Utilizes VGG-Face, OpenFace, PyAudioAnalysis, and BERT for state-of-the-art feature extraction.
- **Web Application:** A full-stack web app (Node.js, Express, MongoDB) for users to upload videos and view results.
- **Data Balancing:** Addresses imbalanced regression using innovative oversampling techniques.

