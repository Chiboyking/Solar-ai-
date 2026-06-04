# Nigeria Solar AI Predictor

A Python-based AI web application predicting solar energy generation across Nigeria using historical and live meteorological data.

## Features
- **11 Nigerian Cities**: Covers South, Middle Belt, and Northern climate zones.
- **AI Models**: Predicts solar output using ANN, CNN, and Hybrid CNN-LSTM.
- **Data Integration**: Integrates historical data from NASA POWER API and live data from OpenWeatherMap API.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**:
   Copy the `.env.example` to `.env` and insert your OpenWeatherMap API Key.
   ```bash
   cp .env.example .env
   ```

3. **Fetch Data & Train Models**:
   Run data fetching script. This fetches 3 years of historical data for 11 cities.
   ```bash
   python fetch_data.py
   ```
   
   Run the model training script (evaluates all three models).
   ```bash
   python train_models.py
   ```

4. **Run Application**:
   Start the Flask web server.
   ```bash
   python app.py
   ```
   Access the dashboard at `http://localhost:3000`

## Architectures
The system uses `Conv1D` for feature extraction and `LSTM` for temporal sequencing to accurately estimate solar yield based on non-linear weather dynamics, achieving highest R2 scores on the CNN-LSTM hybrid.
