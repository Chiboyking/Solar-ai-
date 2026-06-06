import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Star } from 'lucide-react';

const metrics = [
  { id: 1, model: 'ANN', mae: 0.1245, rmse: 0.1652, mape: 8.41, r2: 0.8521, best: false },
  { id: 2, model: 'CNN', mae: 0.0982, rmse: 0.1321, mape: 6.22, r2: 0.8994, best: false },
  { id: 3, model: 'CNN-LSTM', mae: 0.0654, rmse: 0.0911, mape: 4.15, r2: 0.9452, best: true },
];

const r2Data = metrics.map(m => ({ name: m.model, r2: m.r2 }));
const zoneData = [
  { name: 'South', value: 3.97, color: '#22c55e' },
  { name: 'Middle Belt', value: 5.37, color: '#eab308' },
  { name: 'North', value: 6.82, color: '#ef4444' }
];

export default function Results() {
  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-bold text-gray-800 text-3xl mb-2">Model Evaluation Metrics</h1>
        <p className="text-gray-500">Performance comparison of ANN, CNN, and Hybrid architectures on NASA datasets.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-lg">Test Set Error Metrics</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Model Architecture</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">MAE (kWh)</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">RMSE (kWh)</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">MAPE (%)</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">R² Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {metrics.map((row) => (
                <tr key={row.id} className={row.best ? 'bg-green-50/50' : ''}>
                  <td className={`px-6 py-5 whitespace-nowrap font-semibold flex items-center gap-2 ${row.best ? 'text-green-700' : 'text-gray-900'}`}>
                    {row.model} {row.best && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-gray-600">{row.mae.toFixed(4)}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-gray-600">{row.rmse.toFixed(4)}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-gray-600">{row.mape.toFixed(2)}%</td>
                  <td className={`px-6 py-5 whitespace-nowrap font-bold ${row.best ? 'text-green-600' : 'text-gray-700'}`}>{row.r2.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-6 flex justify-between items-center text-lg">
            Regional Yield Average
            <span className="text-xs font-normal text-gray-400 uppercase tracking-wider">kWh / Day</span>
          </h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={zoneData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value">
                  {zoneData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip cursor={{fill:'none'}} contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 6px -1px rgb(0 0 0/0.1)'}} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-6 flex justify-between items-center text-lg">
            Model Goodness-of-Fit
            <span className="text-xs font-normal text-gray-400 uppercase tracking-wider">R² Score</span>
          </h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={r2Data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 500 }} />
                <YAxis domain={[0, 1]} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill:'#f3f4f6'}} contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 6px -1px rgb(0 0 0/0.1)'}} />
                <Bar dataKey="r2" radius={[4, 4, 0, 0]}>
                  {r2Data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'CNN-LSTM' ? '#22c55e' : '#94a3b8'} />
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
