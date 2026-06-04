@echo off
echo ==================================================
echo Starting Nigeria Solar AI Setup...
echo ==================================================

echo.
echo [1/4] Installing Required Dependencies...
pip install -r requirements.txt

echo.
echo [2/4] Setting up Environment Variables...
if not exist .env (
    copy .env.example .env
    echo Created .env file. Optionally add your OpenWeatherMap API key later.
) else (
    echo .env file already exists.
)

echo.
echo [3/4] Fetching NASA and Weather Data...
python fetch_data.py

echo.
echo [4/4] Training AI Models (ANN, CNN, CNN-LSTM)...
python train_models.py

echo.
echo ==================================================
echo Setup Complete! Starting Web Dashboard...
echo ==================================================
python app.py

pause
