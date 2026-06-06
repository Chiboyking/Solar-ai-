import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';

const cities = [
  { name: 'Sokoto', zone: 'North', lat: 13.0, lng: 5.24, output: 7.12, color: 'bg-red-500' },
  { name: 'Kano', zone: 'North', lat: 12.0, lng: 8.59, output: 6.84, color: 'bg-red-500' },
  { name: 'Maiduguri', zone: 'North', lat: 11.8, lng: 13.1, output: 6.71, color: 'bg-red-500' },
  { name: 'Kaduna', zone: 'Middle Belt', lat: 10.5, lng: 7.41, output: 5.62, color: 'bg-yellow-500' },
  { name: 'Abuja', zone: 'Middle Belt', lat: 9.05, lng: 7.49, output: 5.14, color: 'bg-yellow-500' },
  { name: 'Jos', zone: 'Middle Belt', lat: 9.89, lng: 8.85, output: 5.43, color: 'bg-yellow-500' },
  { name: 'Enugu', zone: 'South', lat: 6.45, lng: 7.54, output: 4.22, color: 'bg-green-500' },
  { name: 'Lagos', zone: 'South', lat: 6.52, lng: 3.37, output: 4.12, color: 'bg-green-500' },
  { name: 'Port Harcourt', zone: 'South', lat: 4.81, lng: 7.04, output: 3.84, color: 'bg-green-500' },
];

export default function MapView() {
  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-bold text-gray-800 text-3xl mb-2">Geospatial Solar Map</h1>
        <p className="text-gray-500">Interactive overview of simulated live predictions across Nigerian stations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <div className="bg-[#eef2f6] rounded-2xl shadow-inner border border-gray-200 p-2 relative h-96 lg:h-[600px] overflow-hidden flex items-center justify-center">
            
            {/* Simulated map background (Abstract Grid) */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur px-4 py-3 rounded-lg shadow-sm border border-white flex flex-col gap-2">
               <h4 className="font-bold text-sm text-gray-700 uppercase tracking-widest">Legend</h4>
               <div className="flex items-center gap-2 text-xs font-semibold text-gray-600"><span className="w-3 h-3 rounded-full bg-red-500"></span> North (High Yield)</div>
               <div className="flex items-center gap-2 text-xs font-semibold text-gray-600"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Middle Belt</div>
               <div className="flex items-center gap-2 text-xs font-semibold text-gray-600"><span className="w-3 h-3 rounded-full bg-green-500"></span> South (Lower Yield)</div>
            </div>

            <div className="relative w-full max-w-md h-full flex flex-col justify-center items-center">
              <p className="text-center text-gray-500 font-medium mb-8 bg-white/70 px-4 py-2 rounded-full backdrop-blur shadow-sm border border-white/50 text-sm">
                Interactive Map rendering is simulated for this React preview.
              </p>
              <MapPin className="w-24 h-24 text-gray-300 mx-auto opacity-50" />
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-1/3 flex flex-col">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-96 lg:h-[600px]">
            <div className="p-5 bg-gray-50 border-b border-gray-200">
              <h3 className="font-bold text-gray-800">Observation Stations</h3>
            </div>
            <div className="overflow-y-auto flex-grow divide-y divide-gray-100">
              {cities.map((city, idx) => (
                <div key={idx} className="p-4 hover:bg-green-50/50 cursor-pointer transition-colors flex justify-between items-center group">
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${city.color}`}></span>
                      {city.name}
                    </h4>
                    <p className="text-[10px] uppercase text-gray-400 font-bold mt-1 ml-4">{city.zone} Zone</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="text-gray-900 font-black">{city.output.toFixed(2)}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">kWh</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
