#!/bin/bash
set -e

echo "=================================================="
echo "Starting Nigeria Solar AI Setup..."
echo "=================================================="

echo ""
echo "[1/4] Installing Required Dependencies..."
pip3 install -r requirements.txt

echo ""
echo "[2/4] Setting up Environment Variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file. Optionally add your OpenWeatherMap API key later."
else
    echo ".env file already exists."
fi

echo ""
echo "[3/4] Fetching NASA and Weather Data..."
python3 fetch_data.py

echo ""
echo "[4/4] Training AI Models (ANN, CNN, CNN-LSTM)..."
python3 train_models.py

echo ""
echo "=================================================="
echo "Setup Complete! Starting Web Dashboard..."
echo "=================================================="
python3 app.py
