# Nigeria Solar Energy AI Predictor - Comprehensive Project Report

## 1. Easy-to-Understand Breakdown (How it Works!)
Before diving into the complex technical details, here is a simple explanation of what this project does and how it works:

**The Goal:**
Imagine you have a solar panel on your roof in Nigeria. You want to know exactly how much electricity it will produce right now based on the weather. This project does exactly that for 11 different cities across the country!

**How was the NASA data used? (The AI Training Manual)**
Think of NASA's satellite records as a giant textbook. For years, NASA has recorded the exact amount of sunlight, cloud cover, and temperature for every city in Nigeria. We took 3 years of this historic data and used it as the training manual for our AI. By making the AI "study" this NASA textbook over and over, it learned the exact relationship between Nigerian weather and how much electricity a solar panel generates in those conditions. Once it mastered the past using NASA data, we hooked it up to live weather from the **OpenWeatherMap API** so it could predict what solar panels are doing right now!

**How do the three AI Models differ? (The Three Brains)**
Machine learning simply teaches a computer to recognize patterns. We tested three different AI "brains" (models) to see which was the smartest at predicting solar energy:
1.  **ANN (Artificial Neural Network - The Basic Calculator):** This model looks at the weather *exactly right now* (e.g., "It is 30°C and sunny") and makes a straightforward guess based on simple rules. It is effective but basic, as it doesn't look for deep patterns or remember what just happened an hour ago.
2.  **CNN (Convolutional Neural Network - The Detective):** This model is built to find hidden *patterns*. Instead of just looking at raw numbers, it scans the weather data like a picture, noticing complex relationships (like recognizing that a specific drop in humidity combined with high wind usually means a massive solar drop-off is coming).
3.  **Hybrid CNN-LSTM (The Expert Meteorologist):** This model combines the pattern-finding detective work of the CNN with a "memory" called an LSTM (Long Short-Term Memory).

**Why is the CNN-LSTM Hybrid the absolute best for Solar Forecasting?**
Solar energy relies entirely on two major things: complex weather patterns (like rolling clouds or dust storms) and the steady flow of time (the sun rising, moving across the sky, setting, and the shift between the wet/dry seasons). 
* The **CNN** part of the brain handles the complex weather patterns.
* The **LSTM** part handles the *time* because it has a memory. It understands schedules and remembers the recent past. 
By combining them, the hybrid model understands *both* the pattern of the incoming weather *and* the flow of time and seasons, making it incredibly powerful and accurate at forecasting solar power!

**What Did We Use to Build This? (The Toolbox Explained):**
*   **Python:** The main "engine" or brain of the whole project. It handles all the complex math, downloads the data, and runs the AI.
*   **Flask:** Think of Flask as a "waiter" in a restaurant. When you click "Predict" on the website (your order), Flask takes that request back to the Python engine (the kitchen) to calculate the answer, and then serves the result right back to your screen.
*   **TensorFlow:** The "gym" where our AI brains (the neural networks) go to work out and get trained on the NASA data until they are accurate.
*   **HTML, CSS, & JavaScript:** The foundation of the website you see. HTML builds the skeleton (text, buttons), CSS paints it (colors, spacing), and JavaScript makes it interactive (like doing things without refreshing the page).
*   **Tailwind CSS:** A magical design toolkit. Instead of writing thousands of lines of styling code, it lets us use quick commands to make the app look beautiful and instantly shrink or stretch to fit mobile phones perfectly.
*   **Chart.js & Leaflet.js:** Our visual "artists". Chart.js draws the pretty graphs and bar charts, while Leaflet.js powers the interactive map of Nigeria that you can drag and click.

---

## 2. Introduction and Objectives
The **Nigeria Solar Energy AI Predictor** is a full-stack, data-driven web application designed to forecast solar photovoltaic (PV) generation capacity across Nigeria. It leverages historical meteorological data, real-time weather conditions, and deep learning architectures to provide accurate solar energy estimates.

The system specifically covers 11 key Nigerian cities spread across three major climate zones:
- **South**: Lagos, Port Harcourt, Benin City, Enugu
- **Middle Belt**: Abuja, Kaduna, Jos
- **North**: Kano, Maiduguri, Sokoto, Zaria

The project aims to demonstrate the application of machine learning (specifically, Artificial Neural Networks, Convolutional Neural Networks, and Hybrid CNN-LSTMs) in predicting renewable energy yields based on complex, non-linear atmospheric variables.

---

## 2. Technology Stack

### Backend & Machine Learning (Python)
- **Python 3.x**: The core programming language used for the backend logic and data science tasks.
- **Flask**: A lightweight WSGI web application framework used to build our backend server and RESTful APIs.
- **Flask-CORS**: To handle Cross-Origin Resource Sharing.
- **Pandas & NumPy**: For extensive data manipulation, cleaning, and mathematical operations.
- **Scikit-learn**: Used for data preprocessing (MinMaxScaler for normalization) and evaluation metrics (MAE, RMSE, R-squared).
- **TensorFlow / Keras**: The deep learning framework used to build and train the three AI architectures (ANN, CNN, CNN-LSTM).
- **Requests**: To handle HTTP requests for fetching external data from the NASA POWER and OpenWeatherMap APIs.

### Frontend (HTML/CSS/JS)
- **HTML5 & CSS3**: For structuring and basic styling of the application.
- **Vanilla JavaScript**: Used for DOM manipulation, fetching data from the backend APIs, and updating the UI asynchronously.
- **Tailwind CSS (via CDN)**: A utility-first CSS framework used to rapidly build a fully responsive, modern, and clean user interface.
- **Chart.js (via CDN)**: Used for rendering interactive and responsive data visualizations (Bar charts, Doughnut charts).
- **Leaflet.js (via CDN)**: An open-source JavaScript library used for mobile-friendly interactive maps.
- **Font Awesome (via CDN)**: For scalable vector icons.

### External APIs
- **NASA POWER API**: Provides historical hourly meteorological and solar parameters (irradiance, temp, humidity, etc.). Used for creating the dataset and training the AI models.
- **OpenWeatherMap API**: Provides real-time weather conditions to feed into our trained models for live solar output predictions.

---

## 3. Data Collection and Preprocessing

### 3.1 Data Acquisition (`fetch_data.py`)
The system programmatically fetches 3 years of historical hourly data for all 11 cities from the NASA POWER API. The query requests specific variables:
- `ALLSKY_SFC_SW_DWN`: Downward Solar Irradiance (W/m²)
- `T2M`: Temperature at 2 meters (°C)
- `RH2M`: Relative Humidity (%)
- `CLOUD_AMT`: Cloud Amount (%)
- `WS10M`: Wind Speed at 10 meters (m/s)
- `PRECTOTCORR`: Corrected Precipitation (mm)

Once fetched, the data is tagged with spatial information (city name, climate zone, latitude, longitude) and saved to `data/nigeria_solar_data.csv`.

### 3.2 Target Variable Calculation
We simulate the expected yield of a standard solar panel (approx. 1.6m², 18% efficiency) using the following physics-based formula:
`Power Output (kWh) = Irradiance * 1.6 * 0.18 * [1 - 0.004 * (Temperature - 25)] / 1000`
This calculation factors in the performance degradation of solar panels as temperatures rise above 25°C.

### 3.3 Data Cleaning & Feature Engineering (`train_models.py`)
- **Missing Values**: Time-series gaps are imputed using linear interpolation.
- **Outliers**: Extreme target anomalies are capped using the Interquartile Range (IQR) method.
- **Temporal Cyclical Engineering**: Time-based features (Hour and Month) are transformed into cyclical sine and cosine components (`hour_sin`, `hour_cos`, `month_sin`, `month_cos`). This helps the neural network understand that Month 12 is right next to Month 1, and Hour 23 is next to Hour 0.
- **Seasonal Knowledge**: A binary variable `dry_season` is engineered (1 for Nov-Mar, 0 for Apr-Oct) to capture the distinct climatic changes in Nigeria.
- **Scaling**: All numerical Inputs and Outputs are scaled between [0, 1] using `MinMaxScaler` to ensure faster and more stable neural network convergence.

---

## 4. Model Architectures & Training Strategy

The dataset is strictly split chronologically into:
- **70% Training Set**: Used for model learning.
- **15% Validation Set**: Used to tune parameters and trigger early stopping if the model ceases to learn.
- **15% Test Set**: Used for final evaluation to ensure the model generalizes to unseen futuristic data.

### Model A: Artificial Neural Network (ANN)
A standard Multi-Layer Perceptron (MLP).
- **Architecture**: Inputs -> Dense(64) -> Dropout(0.2) -> Dense(32) -> Dropout(0.2) -> Dense(16) -> Dense(1, Output)
- **Role**: Serves as the baseline deep-learning model capturing global non-linear relationships.

### Model B: Convolutional Neural Network (1D-CNN)
Designed to extract local spatial/feature patterns.
- **Architecture**: Inputs (reshaped as 3D) -> 1D-Conv(32 filters) -> MaxPooling1D(2) -> Flatten -> Dense(32) -> Dense(1, Output).
- **Role**: Excellent at sliding over the weather features to find localized complex patterns (e.g., the immediate inverse relationship between cloud cover and irradiance).

### Model C: Hybrid CNN-LSTM
Our primary, highly-advanced architecture.
- **Architecture**: Inputs -> 1D-Conv(32 filters) -> MaxPooling1D(2) -> LSTM(32 units) -> Dropout(0.2) -> Dense(16) -> Dense(1, Output).
- **Role**: The 1D-CNN layers extract distinct atmospheric feature patterns, while the Long Short-Term Memory (LSTM) layer models the sequential, temporal dependencies of the data. This combination is mathematically ideal for weather-dependent forecasting.

All models are compiled with the **Adam Optimizer** minimizing **Mean Squared Error (MSE)**, and utilize **Early Stopping** to prevent overfitting.

---

## 5. Backend Server & APIs (`app.py`)

The Flask backend serves both the HTML frontend and acts as a REST JSON API.

### Key API Routes:
- `/api/predict (POST)`: Receives a selected city. It queries OpenWeatherMap for live data (or accepts manual data), scales the inputs using the dumped `scaler_X`, runs the data through the highly-optimized TensorFlow `.h5` models, and returns the inverse-transformed prediction (kWh) back to the frontend.
- `/api/weather/<city> (GET)`: Direct bridge to OpenWeatherMap to fetch live atmospheric data with a local fallback mechanism.
- `/api/chart/compare (GET)`: Reads the dataset to calculate average outputs across various cities for chart rendering.
- `/api/metrics (GET)`: Returns the evaluation metrics (MAE, RMSE, MAPE, R2) saved during the training phase.

---

## 6. Frontend & User Interface (`templates/`)

The application embraces a Mobile-First, responsive design relying heavily on Tailwind CSS.
The color palette uses variations of Green and Yellow, paying homage to the Nigerian flag colors.

### 6.1 Views Breakdown:
1. **Dashboard (`index.html`)**: Introduces the project, provides high-level statistics, aggregates daily output averages utilizing **Chart.js**, and offers a "Quick Predict" funnel.
2. **Predict Page (`predict.html`)**: A robust dual-column layout. The user selects a city, the UI auto-fills live conditions (fetching seamlessly via AJAX), and on submission, displays comparative outputs from all three AI models, visually highlighting the recommended Hybrid CNN-LSTM result. It also includes a Manual Override accordion to let users simulate scenarios (e.g., "What if humidity drops by 50%?").
3. **Results Page (`results.html`)**: Evaluates the models graphically. Dynamically builds a sortable data table for Test Set Errors (MAE, RMSE, R-squared) and compares regional PV yields across the South, Middle-belt, and North using Doughnut charts.
4. **Interactive Map (`map.html`)**: Leverages **Leaflet.js** to render a geospatial visualization of Nigeria. It concurrently queries predictions for all 11 cities asynchronously and populates interactive map markers, allowing geographical performance exploration.

## 7. Conclusion

By integrating scalable cloud data (NASA), live telemetry (OpenWeather), and advanced Spatio-Temporal neural networks (CNN-LSTM), this software accurately establishes the relationship between Nigerian micro-climates and Solar Photovoltaic outcomes. The result is a robust forecasting utility that proves Northern states (Sokoto, Kano, Maiduguri) yield substantially higher baseline irradiance profiles than coastal counterparts due to decreased atmospheric diffuse cloud scattering.
