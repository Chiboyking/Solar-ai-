import React from 'react';
import { Building2, SunMedium, Trophy, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const cityData = [
  { name: 'Lagos', value: 4.1, zone: 'South' },
  { name: 'P. Harcourt', value: 3.8, zone: 'South' },
  { name: 'Benin', value: 4.0, zone: 'South' },
  { name: 'Enugu', value: 4.2, zone: 'South' },
  { name: 'Abuja', value: 5.1, zone: 'Middle Belt' },
  { name: 'Kaduna', value: 5.6, zone: 'Middle Belt' },
  { name: 'Jos', value: 5.4, zone: 'Middle Belt' },
  { name: 'Kano', value: 6.8, zone: 'North' },
  { name: 'Maiduguri', value: 6.7, zone: 'North' },
  { name: 'Sokoto', value: 7.1, zone: 'North' },
  { name: 'Zaria', value: 6.4, zone: 'North' },
];

const getColor = (zone: string) => {
  if (zone === 'North') return '#ef4444'; // red-500
  if (zone === 'Middle Belt') return '#eab308'; // yellow-500
  return '#22c55e'; // green-500
};

export default function Dashboard({ navigate }: { navigate: (tab: string) => void }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-10 border border-gray-100 text-center">
        <h1 className="text-3xl md:text-4xl text-green-800 font-bold mb-4 tracking-tight">Nigeria Solar Energy AI Predictor</h1>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
          Harnessing Machine Learning to forecast solar photovoltaic generation 
          across Nigeria's distinct climate zones using historical meteorology and live satellite data.
        </p>
        <button onClick={() => navigate('predict')} className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-8 py-3 min-h-[44px] w-full md:w-auto transition-colors shadow-md text-lg">
          Get Prediction <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-5">
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Cities</p>
            <p className="text-4xl font-bold text-gray-800">11</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-5">
          <div className="bg-yellow-100 text-yellow-600 p-4 rounded-full flex items-center justify-center">
            <SunMedium className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Best Zone</p>
            <p className="text-3xl font-bold text-gray-800">North</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-5">
          <div className="bg-green-100 text-green-600 p-4 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Top City Today</p>
            <p className="text-3xl font-bold text-gray-800">Sokoto</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-1 flex flex-col justify-center">
          <h2 className="font-bold text-gray-800 mb-4 text-xl">Quick Predict</h2>
          <p className="text-sm text-gray-500 mb-6">Select a city to estimate real-time solar generation capacity using simulated live weather data.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select City</label>
              <select className="block w-full rounded-md border-gray-300 border bg-white px-3 py-3 min-h-[44px] shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 text-gray-800">
                <option>Sokoto (North)</option>
                <option>Abuja (Middle Belt)</option>
                <option>Lagos (South)</option>
              </select>
            </div>
            <button onClick={() => navigate('predict')} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg px-6 py-3 min-h-[44px] shadow-sm transition-colors text-lg">
              Predict Now
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h2 className="font-bold text-gray-800 mb-6 text-xl">Average Daily Solar Output (kWh/m²)</h2>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} angle={-45} textAnchor="end" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {cityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(entry.zone)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
