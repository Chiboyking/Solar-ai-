"""
Flask Application for Nigeria Solar AI.
"""
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
import os
import datetime
import numpy as np
import pandas as pd
import pickle
import tensorflow as tf
from tensorflow.keras.models import load_model
from utils import NIGERIA_CITIES
from fetch_data import fetch_live_weather

app = Flask(__name__)
CORS(app)

# Attempt to load models and scalers if they exist
try:
    with open('models/scaler_X.pkl', 'rb') as f:
        scaler_X = pickle.load(f)
    with open('models/scaler_y.pkl', 'rb') as f:
        scaler_y = pickle.load(f)
    
    ann_model = load_model('models/ann.h5')
    cnn_model = load_model('models/cnn.h5')
    cnnlstm_model = load_model('models/cnn_lstm.h5')
    models_loaded = True
except Exception as e:
    print(f"Warning: Models not fully loaded: {e}")
    models_loaded = False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict')
def predict_page():
    return render_template('predict.html')

@app.route('/results')
def results_page():
    return render_template('results.html')

@app.route('/map')
def map_page():
    return render_template('map.html')

@app.route('/api/weather/<city>')
def get_weather(city):
    data = fetch_live_weather(city)
    return jsonify(data)

@app.route('/api/cities')
def get_cities():
    return jsonify(NIGERIA_CITIES)

@app.route('/api/metrics')
def get_metrics():
    try:
        with open('models/metrics.json', 'r') as f:
            metrics = json.load(f)
        return jsonify(metrics)
    except Exception:
        return jsonify({"error": "Metrics not found"}), 404

@app.route('/api/chart/compare')
def get_chart_compare():
    try:
        df = pd.read_csv('data/nigeria_solar_data.csv')
        # Average daily solar output per city
        grouped = df.groupby('city')['target_kwh'].mean() * 24 # rough daily average
        data = {
            "cities": [],
            "values": [],
            "zones": []
        }
        for city in grouped.index:
            data['cities'].append(city)
            data['values'].append(grouped[city])
            data['zones'].append(NIGERIA_CITIES[city]['zone'])
        return jsonify(data)
    except Exception:
        return jsonify({"error": "Data not found"}), 404

@app.route('/api/predict', methods=['POST'])
def run_prediction():
    if not models_loaded:
        return jsonify({"error": "Models not trained. Please run training script."}), 500
        
    req = request.json
    city = req.get('city', 'Abuja')
    
    city_config = NIGERIA_CITIES.get(city)
    if not city_config:
        return jsonify({"error": "City not recognized"}), 400
        
    # Weather values
    weather = req.get('weather')
    if not weather:
        weather = fetch_live_weather(city)
        
    now = datetime.datetime.now()
    hour = now.hour
    month = now.month
    
    # Feature construction
    hour_sin = np.sin(2 * np.pi * hour / 24)
    hour_cos = np.cos(2 * np.pi * hour / 24)
    month_sin = np.sin(2 * np.pi * month / 12)
    month_cos = np.cos(2 * np.pi * month / 12)
    dry_season = 1 if month in [11, 12, 1, 2, 3] else 0
    
    # Simple irradiance estimation based on cloud cover and hour if None provided
    irrad = req.get('irradiance')
    if not irrad:
        # crude estimate
        if 6 < hour < 18:
            base_irrad = 800 * np.sin(np.pi * (hour - 6) / 12)
            irrad = base_irrad * (1 - (weather.get('cloud_cover', 20) / 100) * 0.5)
        else:
            irrad = 0
            
    features = [
        irrad, 
        weather.get('temperature', 25),
        weather.get('humidity', 60),
        weather.get('cloud_cover', 20),
        weather.get('wind_speed', 3),
        0.0, # precipitation
        hour_sin, hour_cos, month_sin, month_cos, dry_season,
        city_config['encoded'], city_config['zone_encoded'],
        city_config['lat'], city_config['lon']
    ]
    
    X_input = np.array(features).reshape(1, -1)
    X_scaled = scaler_X.transform(X_input)
    X_3d = X_scaled.reshape((1, X_scaled.shape[1], 1))
    
    # Predict
    ann_pred = scaler_y.inverse_transform(ann_model.predict(X_scaled, verbose=0))[0][0]
    cnn_pred = scaler_y.inverse_transform(cnn_model.predict(X_3d, verbose=0))[0][0]
    cnnlstm_pred = scaler_y.inverse_transform(cnnlstm_model.predict(X_3d, verbose=0))[0][0]
    
    # Fix negatives
    ann_pred = max(0, float(ann_pred))
    cnn_pred = max(0, float(cnn_pred))
    cnnlstm_pred = max(0, float(cnnlstm_pred))
    
    return jsonify({
        "city": city,
        "zone": city_config['zone'],
        "lat": city_config['lat'],
        "lon": city_config['lon'],
        "live_weather": {
            "temperature": weather.get('temperature', 25),
            "humidity": weather.get('humidity', 60),
            "cloud_cover": weather.get('cloud_cover', 20),
            "wind_speed": weather.get('wind_speed', 3),
            "description": weather.get('description', 'Clear')
        },
        "predictions": {
            "ANN": ann_pred,
            "CNN": cnn_pred,
            "CNN_LSTM": cnnlstm_pred
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=3000, host='0.0.0.0')

