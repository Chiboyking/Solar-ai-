"""
Utility functions and constants for Nigeria Solar AI.
"""
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

NIGERIA_CITIES = {
    "Lagos": {"lat": 6.5244, "lon": 3.3792, "zone": "South", "encoded": 0, "zone_encoded": 0},
    "Port Harcourt": {"lat": 4.8156, "lon": 7.0498, "zone": "South", "encoded": 1, "zone_encoded": 0},
    "Benin City": {"lat": 6.3350, "lon": 5.6037, "zone": "South", "encoded": 2, "zone_encoded": 0},
    "Enugu": {"lat": 6.4584, "lon": 7.5464, "zone": "South", "encoded": 3, "zone_encoded": 0},
    "Abuja": {"lat": 9.0579, "lon": 7.4951, "zone": "Middle Belt", "encoded": 4, "zone_encoded": 1},
    "Kaduna": {"lat": 10.5105, "lon": 7.4165, "zone": "Middle Belt", "encoded": 5, "zone_encoded": 1},
    "Jos": {"lat": 9.8965, "lon": 8.8583, "zone": "Middle Belt", "encoded": 6, "zone_encoded": 1},
    "Kano": {"lat": 12.0022, "lon": 8.5919, "zone": "North", "encoded": 7, "zone_encoded": 2},
    "Maiduguri": {"lat": 11.8463, "lon": 13.1603, "zone": "North", "encoded": 8, "zone_encoded": 2},
    "Sokoto": {"lat": 13.0059, "lon": 5.2476, "zone": "North", "encoded": 9, "zone_encoded": 2},
    "Zaria": {"lat": 11.0765, "lon": 7.7199, "zone": "North", "encoded": 10, "zone_encoded": 2}
}

def calculate_solar_output(irradiance, temp_c):
    """
    Solar PV Formula:
    P_output = Irradiance * 1.6 * 0.18 * (1 - 0.004 * (temp_c - 25))
    Where:
    - Irradiance in W/m2
    - 1.6: panel area in m2
    - 0.18: 18% efficiency
    - 0.004: temperature coefficient per degree C
    Returns: P_output in kWh (assuming roughly Wh output and needs scaling or direct usage)
    Actually, dividing by 1000 to get kWh if it's hourly irradiance.
    """
    # Assuming irradiance is hourly W/m2 (which is Wh/m2 for 1 hour).
    # Convert to kW for production:
    power_watts = irradiance * 1.6 * 0.18 * (1 - 0.004 * (temp_c - 25))
    return max(0, power_watts / 1000.0) # Ensure no negative solar outputs

def mean_absolute_percentage_error(y_true, y_pred):
    """Calculate MAPE"""
    y_true, y_pred = np.array(y_true), np.array(y_pred)
    # prevent division by zero
    mask = y_true != 0
    return (np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100) if np.sum(mask) > 0 else 0

def evaluate_predictions(y_true, y_pred):
    """Evaluate model using MAE, RMSE, MAPE, R2"""
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    mape = mean_absolute_percentage_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)
    return {
        "MAE": float(mae),
        "RMSE": float(rmse),
        "MAPE": float(mape),
        "R2": float(r2)
    }
