import React, { useState } from 'react';
import { 
  Zap, 
  LayoutDashboard, 
  Image as ImageIcon, 
  LocateFixed, 
  Settings, 
  TrendingUp, 
  Cpu, 
  PanelTop, 
  Info,
  MapPin,
  Database,
  Loader2,
  Check
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

// Custom 3D Slider Component
const Slider3D = ({ label, unit, max, step = 1, value, onChange }: any) => {
  const percentage = (value / max) * 100;
  return (
    <div className="flex flex-col gap-3 relative group w-full">
      <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-[#8A94A6]">
        <label className="uppercase tracking-widest">{label} {unit && `(${unit})`}</label>
        <span className="text-white bg-[#151821] px-4 py-1.5 rounded-lg border border-[#1F2433] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] font-mono text-sm group-hover:border-orange-500/30 transition-colors">
          {value}
        </span>
      </div>
      <div className="relative w-full h-3.5 bg-[#151821] rounded-full shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] border border-[#1F2433]">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.4)] transition-all duration-150" 
          style={{ width: `${percentage}%` }}
        ></div>
        <input
          type="range" min="0" max={max} step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
        {/* 3D Thumb visible overlay */}
        <div
          className="absolute top-1/2 -mt-2.5 w-6 h-6 bg-gradient-to-b from-white to-gray-200 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,1)] border border-gray-300 pointer-events-none transition-all duration-150 group-hover:scale-110 z-10 flex items-center justify-center"
          style={{ left: `calc(${percentage}% - 12px)` }}
        >
           <div className="w-2 h-2 bg-orange-500 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"></div>
        </div>
      </div>
    </div>
  );
};

// 3D Card Container Template
const Card3D = ({ children, title, step, className = "" }: any) => (
  <section className={`bg-[#11141E] rounded-3xl p-6 md:p-8 border border-[#1F2433] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),inset_0_1px_rgba(255,255,255,0.05)] relative z-10 ${className}`}>
    {title && (
      <h2 className="text-xs uppercase tracking-widest text-[#8A94A6] font-extrabold mb-6 flex items-center gap-3">
        {step && (
          <span className="bg-gradient-to-br from-orange-500 to-orange-600 w-6 h-6 flex justify-center items-center rounded-md text-white shadow-[0_4px_10px_rgba(249,115,22,0.4)] text-[11px] border border-orange-400/50">
            {step}
          </span>
        )}
        {title}
      </h2>
    )}
    {children}
  </section>
);

export default function App() {
  const [panelSize, setPanelSize] = useState(6);
  const [sunHours, setSunHours] = useState(6.5);
  const [batteryCap, setBatteryCap] = useState(10);
  const [homeUsage, setHomeUsage] = useState(0.5);
  const [batteryLevel, setBatteryLevel] = useState(50);
  const [efficiency, setEfficiency] = useState(80);

  const [chartView, setChartView] = useState<'daily' | 'weekly'>('daily');

  const [actualOutput, setActualOutput] = useState("");
  const [readings, setReadings] = useState<{date: string, value: number}[]>([
    { date: 'Yesterday', value: 14.2 },
    { date: '2 days ago', value: 13.5 },
  ]);

  const handleAddReading = () => {
    if (!actualOutput) return;
    setReadings(prev => [{ date: 'Today', value: parseFloat(actualOutput) }, ...prev]);
    setActualOutput("");
  };

  // Auto-calculated fields for demo
  const dailyTotal = panelSize * sunHours * (efficiency / 100);
  const dailyHomeUsage = homeUsage * 24;
  const netEnergy = dailyTotal - dailyHomeUsage;
  let batteryAfterToday = batteryLevel + (netEnergy / (batteryCap || 1) * 100);
  batteryAfterToday = Math.max(0, Math.min(100, batteryAfterToday));

  // Dynamic Chart Base
  const dailyChartData = [
    { time: '06:00', output: 0 },
    { time: '09:00', output: panelSize * 0.2 },
    { time: '12:00', output: panelSize * (efficiency/100) },
    { time: '15:00', output: panelSize * (efficiency/100) * 0.8 },
    { time: '18:00', output: panelSize * 0.1 },
    { time: '21:00', output: 0 },
  ];

  const weeklyChartData = [
    { time: 'Mon', output: dailyTotal * 0.85 },
    { time: 'Tue', output: dailyTotal * 1.05 },
    { time: 'Wed', output: dailyTotal * 0.6 },
    { time: 'Thu', output: dailyTotal * 1.1 },
    { time: 'Fri', output: dailyTotal * 0.9 },
    { time: 'Sat', output: dailyTotal * 0.95 },
    { time: 'Sun', output: dailyTotal * 1.0 },
  ];

  const chartData = chartView === 'daily' ? dailyChartData : weeklyChartData;

  return (
    <div className="flex bg-[#07090E] min-h-screen text-slate-300 font-sans overflow-hidden selection:bg-orange-500/30">
      
      {/* 3D Neumorphic Sidebar */}
      <aside className="w-[280px] bg-[#11141E] border-r border-[#1F2433] hidden lg:flex flex-col justify-between shadow-[10px_0_40px_rgba(0,0,0,0.6)] z-30 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
        <div>
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4),inset_0_1px_rgba(255,255,255,0.6)] border border-orange-300/30">
              <Zap className="w-5 h-5 text-white drop-shadow-md" fill="currentColor" />
            </div>
            <span className="text-2xl font-black text-white tracking-widest drop-shadow-sm">solariq</span>
          </div>
          <nav className="mt-6 px-5 space-y-3">
            <div className="px-5 py-4 bg-[#151821] text-orange-500 rounded-2xl flex items-center gap-4 font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] border border-[#1F2433] cursor-pointer relative overflow-hidden">
              <div className="absolute left-0 top-0 w-1 h-full bg-orange-500"></div>
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </div>
            <div className="px-5 py-4 text-[#8A94A6] hover:text-white hover:bg-white/5 rounded-2xl flex items-center gap-4 font-bold cursor-pointer transition-all">
              <ImageIcon className="w-5 h-5" /> Gallery
            </div>
          </nav>
        </div>
        <div className="p-8">
          <div className="px-5 py-3 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center gap-2 font-black text-xs tracking-widest border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
            ✨ AI POWERED
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 h-screen overflow-y-auto w-full relative perspective-[1000px]">
        {/* Deep ambient 3D glow */}
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="p-6 md:p-10 lg:p-12 max-w-[1400px] mx-auto space-y-10 animate-in fade-in zoom-in-[0.98] duration-700">
          
          {/* Header */}
          <header className="flex flex-col gap-4 relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-[#6A7486] drop-shadow-xl tracking-tight leading-tight">
              Smart Solar <br/>
              <span className="text-white glow">Prediction</span>
            </h1>
            <p className="text-sm font-bold text-[#8A94A6] flex flex-wrap gap-2 md:gap-3 items-center tracking-wide">
              <span className="text-orange-500 flex items-center gap-1.5"><Cpu className="w-4 h-4"/> Real-time AI forecasting</span>
              <span className="text-[#3A4355]">|</span>
              Live weather forecast
              <span className="text-[#3A4355]">|</span>
              Built for Nigeria's UV
            </p>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
            
            {/* Left Column (Settings & Inputs) */}
            <div className="xl:col-span-7 space-y-8">
              
              {/* 1. YOUR LOCATION */}
              <Card3D title="Your Location" step="1" className="overflow-hidden group">
                <div className="absolute -right-24 -top-24 w-64 h-64 bg-orange-500/10 rounded-full blur-[60px] transition-transform duration-700 group-hover:scale-150 pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="bg-[#151821] rounded-2xl p-5 border border-[#1F2433] mb-5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)]">
                    <p className="text-[#8A94A6] text-sm font-medium leading-relaxed">
                      Tap below — your browser will ask for location permission. Tap <strong className="text-white">Allow</strong> and weather loads instantly.
                    </p>
                  </div>
                  <button className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white font-bold text-sm uppercase tracking-widest py-4 md:py-5 rounded-2xl flex justify-center items-center gap-3 shadow-[0_15px_30px_rgba(249,115,22,0.3),inset_0_2px_rgba(255,255,255,0.4)] transition-all active:scale-[0.98]">
                    <LocateFixed className="w-5 h-5 drop-shadow-md" /> Detect My Location Automatically
                  </button>
                </div>
              </Card3D>

              {/* 2. SYSTEM SETTINGS */}
              <Card3D title="System Settings" step="2">
                <div className="space-y-8">
                  <Slider3D label="Panel Size" unit="kW" max={20} step={0.5} value={panelSize} onChange={setPanelSize} />
                  <Slider3D label="Sun Hours / Day" max={12} step={0.5} value={sunHours} onChange={setSunHours} />
                  <Slider3D label="Battery Capacity" unit="kWh" max={50} value={batteryCap} onChange={setBatteryCap} />
                  <Slider3D label="Home Usage" unit="kWh/hr" max={5} step={0.1} value={homeUsage} onChange={setHomeUsage} />
                  <Slider3D label="Battery Level Now" unit="%" max={100} value={batteryLevel} onChange={setBatteryLevel} />
                  <Slider3D label="System Efficiency" unit="%" max={100} value={efficiency} onChange={setEfficiency} />
                </div>
              </Card3D>

            </div>

            {/* Right Column (Predictions & Metrics) */}
            <div className="xl:col-span-5 space-y-8">
              
              {/* 3. PREDICTION */}
              <Card3D title="Prediction" step="3">
                <div className="flex flex-col gap-5">
                  {/* Metric 1 */}
                  <div className="bg-[#151821] rounded-2xl p-6 border border-[#1F2433] shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.02)] relative overflow-hidden flex justify-between items-center group">
                    <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none group-hover:from-orange-500/20 transition-all"></div>
                    <div>
                      <p className="text-[#8A94A6] text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-orange-500" /> Daily Total
                      </p>
                      <p className="text-3xl font-black text-white drop-shadow-md tracking-tight">
                        {dailyTotal.toFixed(1)} <span className="text-sm font-bold text-orange-500 tracking-normal">kWh</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Metric 2 */}
                  <div className="bg-[#151821] rounded-2xl p-6 border border-[#1F2433] shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.02)] relative overflow-hidden flex justify-between items-center group">
                    <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none group-hover:from-indigo-500/20 transition-all"></div>
                    <div>
                      <p className="text-[#8A94A6] text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <PanelTop className="w-3.5 h-3.5 text-indigo-500" /> Home Usage
                      </p>
                      <p className="text-3xl font-black text-white drop-shadow-md tracking-tight">
                        {dailyHomeUsage.toFixed(1)} <span className="text-sm font-bold text-indigo-500 tracking-normal">kWh/day</span>
                      </p>
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="bg-[#151821] rounded-2xl p-6 border border-[#1F2433] shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.02)] relative overflow-hidden flex justify-between items-center group">
                    <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none group-hover:from-emerald-500/20 transition-all"></div>
                    <div>
                       <p className="text-[#8A94A6] text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-emerald-500" /> Battery After Today
                      </p>
                      <p className="text-3xl font-black text-white drop-shadow-md tracking-tight">
                        {batteryAfterToday.toFixed(0)} <span className="text-sm font-bold text-emerald-500 tracking-normal">%</span>
                      </p>
                    </div>
                  </div>
                </div>
              </Card3D>

              {/* 4. SOLAR PROFILE CHART */}
              <Card3D title="Solar Profile" step="4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="text-left">
                    <h3 className="text-white font-bold text-lg tracking-wide">Estimated Solar Output <span className="text-[#8A94A6] font-normal text-sm">- LAGOS</span></h3>
                    <p className="text-[#8A94A6] text-xs mt-1">{chartView === 'daily' ? 'Typical daily output by hour of day' : '7-day output forecast'}</p>
                  </div>
                  <div className="flex bg-[#151821] p-1 rounded-lg border border-[#1F2433] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                    <button 
                      onClick={() => setChartView('daily')}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${chartView === 'daily' ? 'bg-orange-500 text-white shadow-[0_2px_8px_rgba(249,115,22,0.4)]' : 'text-[#6A7486] hover:text-[#8A94A6]'}`}
                    >
                      Daily
                    </button>
                    <button 
                      onClick={() => setChartView('weekly')}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all ${chartView === 'weekly' ? 'bg-orange-500 text-white shadow-[0_2px_8px_rgba(249,115,22,0.4)]' : 'text-[#6A7486] hover:text-[#8A94A6]'}`}
                    >
                      Weekly
                    </button>
                  </div>
                </div>
                <div className="h-64 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#eab308" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F2433" vertical={false} />
                      <XAxis dataKey="time" stroke="#6A7486" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                      <YAxis stroke="#6A7486" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => val.toFixed(1)} />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: '#151821', 
                          border: '1px solid #1F2433', 
                          borderRadius: '12px', 
                          boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
                          color: '#fff'
                        }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                        labelStyle={{ color: '#8A94A6', marginBottom: '4px', fontSize: '12px' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#8A94A6', paddingTop: '20px' }}/>
                      <Area 
                        type="monotone" 
                        dataKey="output" 
                        name="Solar Output (kW)"
                        stroke="#eab308" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorOutput)" 
                        dot={{ r: 4, fill: "#151821", stroke: "#eab308", strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: "#eab308", stroke: "#fff", strokeWidth: 2, shadow: "0 0 10px rgba(234,179,8,0.5)" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card3D>

              {/* 5. LOG READINGS */}
              <div className="space-y-6">
                <Card3D title="ADD TODAY'S READING" step="+" className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-widest ml-1">Date</label>
                      <input type="date" className="w-full bg-[#151821] border border-[#1F2433] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-orange-500/50 transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-widest ml-1">Time</label>
                      <input type="time" defaultValue="08:00" className="w-full bg-[#151821] border border-[#1F2433] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-orange-500/50 transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-widest ml-1">Solar Output (kWh)</label>
                      <input type="number" placeholder="e.g. 4.5" className="w-full bg-[#151821] border border-[#1F2433] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-orange-500/50 transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] placeholder-[#3A4355]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-widest ml-1">Battery Start (%)</label>
                      <input type="number" placeholder="e.g. 45" className="w-full bg-[#151821] border border-[#1F2433] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-orange-500/50 transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] placeholder-[#3A4355]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-widest ml-1">Battery End (%)</label>
                      <input type="number" placeholder="e.g. 85" className="w-full bg-[#151821] border border-[#1F2433] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-orange-500/50 transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] placeholder-[#3A4355]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-widest ml-1">Home Usage (kWh)</label>
                      <input type="number" placeholder="e.g. 3.2" className="w-full bg-[#151821] border border-[#1F2433] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-orange-500/50 transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] placeholder-[#3A4355]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-widest ml-1">Temperature (°C)</label>
                      <input type="number" placeholder="e.g. 32" className="w-full bg-[#151821] border border-[#1F2433] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-orange-500/50 transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] placeholder-[#3A4355]" />
                    </div>
                    <div className="flex flex-col gap-1.5 lg:col-span-2">
                      <label className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-widest ml-1">Weather</label>
                      <select className="w-full bg-[#151821] border border-[#1F2433] rounded-xl px-4 py-3 text-sm text-[#8A94A6] font-medium focus:outline-none focus:border-orange-500/50 transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] appearance-none">
                        <option>Select...</option>
                        <option>Sunny</option>
                        <option>Partly Cloudy</option>
                        <option>Cloudy</option>
                        <option>Rainy</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 mb-6">
                    <label className="text-[10px] font-bold text-[#8A94A6] uppercase tracking-widest ml-1">Notes (Optional)</label>
                    <input type="text" placeholder="e.g. Generator ran for 2hrs, load shedding..." className="w-full bg-[#151821] border border-[#1F2433] rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-orange-500/50 transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] placeholder-[#3A4355]" />
                  </div>
                  <div className="flex gap-4 items-center">
                    <button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-[#11141E] font-bold text-sm uppercase tracking-widest py-3.5 rounded-xl flex justify-center items-center shadow-[0_10px_20px_rgba(249,115,22,0.3),inset_0_2px_rgba(255,255,255,0.4)] transition-all active:scale-[0.98]">
                      + Save Reading
                    </button>
                    <button className="bg-[#1F2433] hover:bg-[#2A3042] text-white font-bold text-sm px-6 py-3.5 rounded-xl border border-[#3A4355] shadow-[inset_0_1px_rgba(255,255,255,0.05)] transition-all flex items-center gap-2">
                       <div className="w-2 h-2 bg-orange-500 rounded-full"></div> Use Now
                    </button>
                  </div>
                </Card3D>
                
                <Card3D title="YOUR DATA SUMMARY" step={<Database className="w-3.5 h-3.5" />}>
                   <div className="bg-[#151821] rounded-2xl p-10 border border-[#1F2433] shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center text-center">
                     <div className="w-12 h-12 bg-[#1F2433] rounded-xl flex items-center justify-center mb-4 shadow-[inset_0_1px_rgba(255,255,255,0.05)]">
                       <svg className="w-6 h-6 text-[#8A94A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                       </svg>
                     </div>
                     <p className="text-[#8A94A6] text-sm font-medium">No readings yet.</p>
                     <p className="text-[#6A7486] text-xs">Add your first reading above to get started.</p>
                   </div>
                </Card3D>
                
                <Card3D title="WHY LOG YOUR DATA?" step={<Info className="w-3.5 h-3.5" />}>
                  <p className="text-[#8A94A6] text-sm leading-relaxed mb-6">
                    The AI model was trained on estimated data. When you log your <strong className="text-white">real panel readings</strong>, your predictions become tailored to your exact panels, location, and usage patterns.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                      </div>
                      <p className="text-[#8A94A6] text-sm font-medium">Read your inverter display morning and evening</p>
                    </div>
                     <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                      </div>
                      <p className="text-[#8A94A6] text-sm font-medium">Takes less than 1 minute per day</p>
                    </div>
                     <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                      </div>
                      <p className="text-[#8A94A6] text-sm font-medium">After 2 weeks your model is significantly more accurate</p>
                    </div>
                     <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                      </div>
                      <p className="text-[#8A94A6] text-sm font-medium">Data is saved in your browser &mdash; never lost</p>
                    </div>
                  </div>
                </Card3D>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
