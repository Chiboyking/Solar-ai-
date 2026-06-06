import React, { useState } from 'react';
import { Loader2, Thermometer, Droplets, Cloud, Wind, ChevronDown, CheckCircle2, MapPin, SunMedium } from 'lucide-react';

export default function Predict() {
  const [predicting, setPredicting] = useState(false);
  const [results, setResults] = useState<{ann: number, cnn: number, lstm: number} | null>(null);
  const [manualOpen, setManualOpen] = useState(false);

  const handlePredict = () => {
    setPredicting(true);
    setResults(null);
    setTimeout(() => {
      setResults({ ann: 5.62, cnn: 5.89, lstm: 6.45 });
      setPredicting(false);
    }, 1200);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-bold text-gray-800 text-3xl mb-2">Live Prediction</h1>
        <p className="text-gray-500">Estimate real-time PV generation capacity using simulated weather.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Location</label>
            <select className="block w-full rounded-md border-gray-300 border text-gray-800 bg-white px-3 py-3 min-h-[44px] mb-6 focus:border-green-500 focus:ring-green-500 outline-none shadow-sm">
              <option>Sokoto (North)</option>
              <option>Kano (North)</option>
              <option>Abuja (Middle Belt)</option>
              <option>Lagos (South)</option>
            </select>
            
            <button 
              onClick={handlePredict}
              disabled={predicting}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-6 py-4 min-h-[44px] shadow-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-70 text-lg"
            >
              {predicting ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Weather...</> : 'Predict from Live Weather'}
            </button>
          </div>
          
          <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-6">
            <h3 className="font-semibold text-blue-900 mb-5 border-b border-blue-200 pb-3 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-500" /> Current Conditions (Simulated)
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-blue-500 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1"><Thermometer className="w-4 h-4"/> Temp</p>
                <p className="font-bold text-blue-900 text-2xl">34.2&deg;C</p>
              </div>
              <div>
                <p className="text-xs text-blue-500 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1"><Droplets className="w-4 h-4"/> Humidity</p>
                <p className="font-bold text-blue-900 text-2xl">22%</p>
              </div>
              <div>
                <p className="text-xs text-blue-500 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1"><Cloud className="w-4 h-4"/> Cloud Cover</p>
                <p className="font-bold text-blue-900 text-2xl">10%</p>
              </div>
              <div>
                <p className="text-xs text-blue-500 uppercase tracking-wide font-semibold mb-1 flex items-center gap-1"><Wind className="w-4 h-4"/> Wind</p>
                <p className="font-bold text-blue-900 text-2xl">4.5 m/s</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button onClick={() => setManualOpen(!manualOpen)} className="w-full px-6 py-4 flex justify-between items-center text-left bg-gray-50 hover:bg-gray-100 font-semibold text-gray-700">
              Manual Override
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${manualOpen ? 'rotate-180' : ''}`} />
            </button>
            {manualOpen && (
              <div className="p-6 border-t border-gray-100 space-y-4 bg-white animate-in slide-in-from-top-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Temperature (&deg;C)</label>
                    <input type="number" defaultValue="34" className="w-full text-gray-800 rounded-md border-gray-300 border p-3 outline-none focus:border-green-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Cloud Cover (%)</label>
                    <input type="number" defaultValue="10" className="w-full text-gray-800 rounded-md border-gray-300 border p-3 outline-none focus:border-green-500" />
                  </div>
                </div>
                <button onClick={handlePredict} className="w-full bg-gray-800 hover:bg-black text-white font-semibold rounded-lg px-6 py-3 transition-colors mt-2 min-h-[44px]">
                   Predict with Manual Input
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 flex flex-col h-full min-h-[500px]">
          <h2 className="font-bold text-gray-800 text-xl border-b pb-4 mb-8">Prediction Results</h2>
          
          {!results && !predicting && (
            <div className="text-center text-gray-400 my-auto">
              <SunMedium className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Select a city and click predict to see model outputs.</p>
            </div>
          )}

          {predicting && (
             <div className="text-center text-green-600 my-auto flex flex-col items-center">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="font-medium animate-pulse">Running Neural Networks...</p>
             </div>
          )}

          {results && !predicting && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
              <div className="text-center mb-8">
                <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-2">12:30 PM WAT</p>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">Sokoto</h3>
                <p className="text-green-600 font-medium text-sm flex items-center justify-center gap-1">
                  <MapPin className="w-4 h-4" /> North Zone | Lat: 13.00, Lon: 5.24
                </p>
              </div>
              
              <div className="space-y-4 flex-grow flex flex-col justify-end">
                <div className="border border-gray-200 rounded-xl p-5 flex justify-between items-center bg-gray-50">
                  <div>
                    <h4 className="font-bold text-gray-700">ANN</h4>
                    <p className="text-xs text-gray-500">Baseline Multi-Layer</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{results.ann.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 uppercase font-bold">kWh</p>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-xl p-5 flex justify-between items-center bg-gray-50">
                  <div>
                    <h4 className="font-bold text-gray-700">CNN</h4>
                    <p className="text-xs text-gray-500">Spatial Pattern Config</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{results.cnn.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 uppercase font-bold">kWh</p>
                  </div>
                </div>
                
                <div className="border-2 border-green-500 rounded-xl p-5 flex justify-between items-center bg-green-50 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Best Model
                  </div>
                  <div className="mt-2">
                    <h4 className="font-bold text-green-900 text-lg">Hybrid CNN-LSTM</h4>
                    <p className="text-sm text-green-700 font-medium">Spatio-Temporal Logic</p>
                  </div>
                  <div className="text-right mt-2">
                    <p className="text-4xl font-black text-green-700">{results.lstm.toFixed(2)}</p>
                    <p className="text-sm font-bold text-green-600 uppercase">kWh</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
