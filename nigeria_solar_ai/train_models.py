"""
Model training pipeline for Nigeria Solar AI.
Trains ANN, CNN, and Hybrid CNN-LSTM models.
"""
import os
import pickle
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv1D, MaxPooling1D, Flatten, LSTM, Dropout, Input
from tensorflow.keras.callbacks import EarlyStopping
from utils import NIGERIA_CITIES, evaluate_predictions

# Ensure reproducible results
tf.random.set_seed(42)
np.random.seed(42)

def preprocess_data(filepath='data/nigeria_solar_data.csv'):
    df = pd.read_csv(filepath)
    df['datetime'] = pd.to_datetime(df['datetime'])
    
    # Sort chronologically for proper time-series splitting
    df = df.sort_values('datetime').reset_index(drop=True)
    
    # Impute Time-series gaps
    numeric_cols = ['irradiance', 'temperature', 'humidity', 'cloud_cover', 'wind_speed', 'precipitation', 'target_kwh']
    df[numeric_cols] = df[numeric_cols].interpolate(method='linear')
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median()) # for the very first rows
    
    # IQR outlier removal for target loosely
    Q1 = df['target_kwh'].quantile(0.25)
    Q3 = df['target_kwh'].quantile(0.75)
    IQR = Q3 - Q1
    upper_bound = Q3 + 1.5 * IQR
    df['target_kwh'] = np.where(df['target_kwh'] > upper_bound, upper_bound, df['target_kwh'])
    
    # Feature Engineering
    df['hour'] = df['datetime'].dt.hour
    df['day_of_year'] = df['datetime'].dt.dayofyear
    df['month'] = df['datetime'].dt.month
    
    # Cyclical Features
    df['hour_sin'] = np.sin(2 * np.pi * df['hour']/24)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour']/24)
    df['month_sin'] = np.sin(2 * np.pi * df['month']/12)
    df['month_cos'] = np.cos(2 * np.pi * df['month']/12)
    
    # Dry Season Array: Nov(11) to Mar(3)
    df['dry_season'] = df['month'].apply(lambda x: 1 if x in [11, 12, 1, 2, 3] else 0)
    
    # Label encoding (Using our predefined)
    df['city_encoded'] = df['city'].map(lambda x: NIGERIA_CITIES[x]['encoded'])
    df['zone_encoded'] = df['city'].map(lambda x: NIGERIA_CITIES[x]['zone_encoded'])
    
    features = [
        'irradiance', 'temperature', 'humidity', 'cloud_cover', 'wind_speed', 'precipitation',
        'hour_sin', 'hour_cos', 'month_sin', 'month_cos', 'dry_season', 
        'city_encoded', 'zone_encoded', 'lat', 'lon'
    ]
    target = 'target_kwh'
    
    # Time based split
    n = len(df)
    train_idx = int(n * 0.7)
    val_idx = int(n * 0.85)
    
    train_df = df.iloc[:train_idx]
    val_df = df.iloc[train_idx:val_idx]
    test_df = df.iloc[val_idx:]
    
    # Scaling
    scaler_X = MinMaxScaler()
    scaler_y = MinMaxScaler()
    
    X_train = scaler_X.fit_transform(train_df[features])
    y_train = scaler_y.fit_transform(train_df[[target]])
    
    X_val = scaler_X.transform(val_df[features])
    y_val = scaler_y.transform(val_df[[target]])
    
    X_test = scaler_X.transform(test_df[features])
    y_test = scaler_y.transform(test_df[[target]])
    
    os.makedirs('models', exist_ok=True)
    with open('models/scaler_X.pkl', 'wb') as f:
        pickle.dump(scaler_X, f)
    with open('models/scaler_y.pkl', 'wb') as f:
        pickle.dump(scaler_y, f)
        
    return X_train, y_train, X_val, y_val, X_test, y_test, scaler_y, test_df, features

def build_ann(input_dim):
    model = Sequential([
        Input(shape=(input_dim,)),
        Dense(64, activation='relu'),
        Dropout(0.2),
        Dense(32, activation='relu'),
        Dropout(0.2),
        Dense(16, activation='relu'),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mse')
    return model

def build_cnn(input_shape):
    model = Sequential([
        Input(shape=input_shape),
        Conv1D(filters=32, kernel_size=2, activation='relu'),
        MaxPooling1D(pool_size=2),
        Flatten(),
        Dense(32, activation='relu'),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mse')
    return model

def build_cnn_lstm(input_shape):
    model = Sequential([
        Input(shape=input_shape),
        Conv1D(filters=32, kernel_size=2, activation='relu'),
        MaxPooling1D(pool_size=2),
        LSTM(32, return_sequences=False),
        Dropout(0.2),
        Dense(16, activation='relu'),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mse')
    return model

def train_and_eval():
    print("Preprocessing data...")
    X_train, y_train, X_val, y_val, X_test, y_test, scaler_y, test_df, features = preprocess_data()
    
    # Data reshape for CNN and LSTM
    # Using timestep=1 because it's point predictions based on weather
    X_train_3d = X_train.reshape((X_train.shape[0], X_train.shape[1], 1))
    X_val_3d = X_val.reshape((X_val.shape[0], X_val.shape[1], 1))
    X_test_3d = X_test.reshape((X_test.shape[0], X_test.shape[1], 1))
    
    es = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
    
    print("Training ANN...")
    ann = build_ann(X_train.shape[1])
    ann.fit(X_train, y_train, validation_data=(X_val, y_val), epochs=100, batch_size=256, callbacks=[es], verbose=0)
    ann.save('models/ann.h5')
    
    print("Training CNN...")
    cnn = build_cnn((X_train_3d.shape[1], X_train_3d.shape[2]))
    cnn.fit(X_train_3d, y_train, validation_data=(X_val_3d, y_val), epochs=100, batch_size=256, callbacks=[es], verbose=0)
    cnn.save('models/cnn.h5')
    
    print("Training CNN-LSTM...")
    cnn_lstm = build_cnn_lstm((X_train_3d.shape[1], X_train_3d.shape[2]))
    cnn_lstm.fit(X_train_3d, y_train, validation_data=(X_val_3d, y_val), epochs=100, batch_size=256, callbacks=[es], verbose=0)
    cnn_lstm.save('models/cnn_lstm.h5')
    
    # Save test metrics
    print("Evaluating models...")
    y_test_inv = scaler_y.inverse_transform(y_test)
    
    ann_pred = scaler_y.inverse_transform(ann.predict(X_test, verbose=0))
    cnn_pred = scaler_y.inverse_transform(cnn.predict(X_test_3d, verbose=0))
    cnnlstm_pred = scaler_y.inverse_transform(cnn_lstm.predict(X_test_3d, verbose=0))
    
    metrics = {
        "ANN": evaluate_predictions(y_test_inv, ann_pred),
        "CNN": evaluate_predictions(y_test_inv, cnn_pred),
        "CNN_LSTM": evaluate_predictions(y_test_inv, cnnlstm_pred)
    }
    
    import json
    with open('models/metrics.json', 'w') as f:
        json.dump(metrics, f)
        
    print("Training complete. Models and metrics saved.")

if __name__ == "__main__":
    train_and_eval()
