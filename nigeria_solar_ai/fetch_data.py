"""
Data fetching module for NASA POWER API and OpenWeatherMap API. 
"""
import os
import requests
import pandas as pd
import datetime
from dotenv import load_dotenv
from utils import NIGERIA_CITIES, calculate_solar_output

load_dotenv()

def fetch_nasa_power_data():
    """
    Fetch 3 years of hourly data from NASA POWER API for all cities.
    API Endpoint: https://power.larc.nasa.gov/api/system/control
    """
    # 3 years back from today
    end_date = datetime.datetime.now()
    start_date = end_date - datetime.timedelta(days=3*365)
    
    start_str = start_date.strftime("%Y%m%d")
    end_str = end_date.strftime("%Y%m%d")
    
    # NASA POWER parameters
    # ALLSKY_SFC_SW_DWN: Solar irradiance
    # T2M: Temperature
    # RH2M: Relative Humidity
    # CLOUD_AMT: Cloud Amount
    # WS10M: Wind Speed
    # PRECTOTCORR: Precipitation
    parameters = "ALLSKY_SFC_SW_DWN,T2M,RH2M,CLOUD_AMT,WS10M,PRECTOTCORR"
    
    all_city_data = []
    
    os.makedirs('data', exist_ok=True)
    
    for city, config in NIGERIA_CITIES.items():
        print(f"Fetching data for {city}...")
        url = (
            f"https://power.larc.nasa.gov/api/temporal/hourly/point"
            f"?parameters={parameters}"
            f"&community=RE&longitude={config['lon']}&latitude={config['lat']}"
            f"&start={start_str}&end={end_str}&format=JSON"
        )
        
        try:
            response = requests.get(url, timeout=30)
            if response.status_code == 200:
                data = response.json()
                if 'properties' in data and 'parameter' in data['properties']:
                    params = data['properties']['parameter']
                    
                    # Convert to dataframe
                    df = pd.DataFrame({
                        'irradiance': list(params['ALLSKY_SFC_SW_DWN'].values()),
                        'temperature': list(params['T2M'].values()),
                        'humidity': list(params['RH2M'].values()),
                        'cloud_cover': list(params['CLOUD_AMT'].values()),
                        'wind_speed': list(params['WS10M'].values()),
                        'precipitation': list(params['PRECTOTCORR'].values())
                    })
                    
                    # Add timestamps
                    time_keys = list(params['T2M'].keys())
                    # Format: YYYYMMDDHH
                    df['datetime'] = pd.to_datetime(time_keys, format="%Y%m%d%H")
                    df['city'] = city
                    df['zone'] = config['zone']
                    df['lat'] = config['lat']
                    df['lon'] = config['lon']
                    
                    # Handle NASA Power missing values commonly represented as -999.0
                    df.replace(-999.0, pd.NA, inplace=True)
                    
                    print(f"  -> Got {len(df)} records for {city}")
                    all_city_data.append(df)
            else:
                print(f"  -> Failed to fetch for {city}: {response.status_code}")
        except Exception as e:
            print(f"  -> Error for {city}: {e}")
            
    if all_city_data:
        master_df = pd.concat(all_city_data, ignore_index=True)
        # Calculate target before saving
        # Replace missing temporarily for calculation or leave NA to be handled later
        master_df['irradiance'] = pd.to_numeric(master_df['irradiance'])
        master_df['temperature'] = pd.to_numeric(master_df['temperature'])
        master_df['target_kwh'] = master_df.apply(
            lambda x: calculate_solar_output(x['irradiance'], x['temperature']) 
            if pd.notnull(x['irradiance']) and pd.notnull(x['temperature']) else pd.NA, 
            axis=1
        )
        master_df.to_csv('data/nigeria_solar_data.csv', index=False)
        print("Data merging complete. Saved to data/nigeria_solar_data.csv")
    else:
        print("Failed to fetch data for all cities.")

def fetch_live_weather(city_name):
    """
    Fetch live weather for a city using OpenWeatherMap.
    Falls back to CSV data if API fails.
    """
    city_config = NIGERIA_CITIES.get(city_name)
    if not city_config:
        return {"error": "City not found"}
        
    api_key = os.getenv('OPENWEATHERMAP_API_KEY')
    weather_data = None
    
    if api_key and api_key != "your_openweathermap_api_key_here":
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={city_config['lat']}&lon={city_config['lon']}&appid={api_key}&units=metric"
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                data = response.json()
                weather_data = {
                    "temperature": data['main']['temp'],
                    "humidity": data['main']['humidity'],
                    "cloud_cover": data['clouds']['all'],
                    "wind_speed": data['wind']['speed'],
                    "description": data['weather'][0]['description'].capitalize()
                }
        except Exception as e:
            print(f"Live API error: {e}")
            
    # Fallback to local
    if not weather_data:
        print("Using fallback local data")
        try:
            df = pd.read_csv('data/nigeria_solar_data.csv')
            city_df = df[df['city'] == city_name].dropna().tail(1)
            if not city_df.empty:
                row = city_df.iloc[0]
                weather_data = {
                    "temperature": float(row['temperature']),
                    "humidity": float(row['humidity']),
                    "cloud_cover": float(row['cloud_cover']),
                    "wind_speed": float(row['wind_speed']),
                    "description": "Historical Data Fallback"
                }
            else:
                weather_data = {
                    "temperature": 25.0, "humidity": 60.0, "cloud_cover": 20.0, "wind_speed": 3.0,
                    "description": "Default Data Fallback"
                }
        except Exception:
            weather_data = {
                "temperature": 25.0, "humidity": 60.0, "cloud_cover": 20.0, "wind_speed": 3.0,
                "description": "Default Data Fallback"
            }
            
    return weather_data

if __name__ == "__main__":
    fetch_nasa_power_data()
