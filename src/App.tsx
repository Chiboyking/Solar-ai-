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
      <div className="flex justify-between items-center text-[10px] sm:text-xs font-semibold text-zinc-400">
        <label className="uppercase tracking-widest">{label} {unit && `(${unit})`}</label>
        <span className="text-zinc-100 bg-white/5 px-3 py-1 rounded-md border border-white/5 font-mono text-xs transition-colors">
          {value}
        </span>
      </div>
      <div className="relative w-full h-1.5 bg-white/5 rounded-full border border-white/5">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-150" 
          style={{ width: `${percentage}%` }}
        ></div>
        <input
          type="range" min="0" max={max} step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
        {/* Thumb visible overlay */}
        <div
          className="absolute top-1/2 -mt-2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.4)] pointer-events-none transition-transform duration-150 group-hover:scale-125 z-10 flex items-center justify-center ring-2 ring-cyan-500/50"
          style={{ left: `calc(${percentage}% - 8px)` }}
        >
        </div>
      </div>
    </div>
  );
};

// 3D Card Container Template
const Card3D = ({ children, title, step, className = "" }: any) => (
  <section className={`bg-[#040816] rounded-2xl p-6 md:p-8 border border-white/5 shadow-2xl relative z-10 ${className}`}>
    {title && (
      <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-6 flex items-center gap-3">
        {step && (
          <span className="bg-white/5 w-6 h-6 flex justify-center items-center rounded-md text-zinc-300 text-[10px] border border-white/10 font-mono">
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
    <div className="flex bg-[#020617] min-h-screen text-zinc-300 font-sans overflow-hidden selection:bg-cyan-500/30">
      
      {/* Sleek Sidebar */}
      <aside className="w-[280px] bg-[#020617] border-r border-white/5 hidden lg:flex flex-col justify-between z-30 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none"></div>
        <div>
          <div className="p-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-display font-bold text-zinc-50 tracking-tight">Solariq</span>
          </div>
          <nav className="mt-4 px-4 space-y-1">
            <div className="px-4 py-3 bg-white/5 text-cyan-400 rounded-lg flex items-center gap-3 font-medium border border-white/5 cursor-pointer transition-all">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </div>
            <div className="px-4 py-3 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 rounded-lg flex items-center gap-3 font-medium cursor-pointer transition-all">
              <ImageIcon className="w-4 h-4" /> Gallery
            </div>
          </nav>
        </div>
        <div className="p-6">
          <div className="px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center gap-2 font-medium text-xs tracking-wide border border-cyan-500/20">
             AI POWERED
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 h-screen overflow-y-auto w-full relative">
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

        <div className="p-6 md:p-10 lg:p-12 max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-1000">
          
          {/* Header */}
          <header className="flex flex-col gap-3 relative z-10">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-zinc-50 tracking-tight">
              Smart Solar <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Prediction</span>
            </h1>
            <p className="text-sm font-medium text-zinc-500 flex flex-wrap gap-2 md:gap-3 items-center">
              <span className="text-cyan-400 flex items-center gap-1.5"><Cpu className="w-4 h-4"/> Real-time AI forecasting</span>
              <span className="text-zinc-800">|</span>
              Live weather integrated
              <span className="text-zinc-800">|</span>
              Built for Nigeria's UV
            </p>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
            
            {/* Left Column (Settings & Inputs) */}
            <div className="xl:col-span-7 space-y-8">
              
              {/* 1. YOUR LOCATION */}
              <Card3D title="Your Location" step="1" className="overflow-hidden group">
                <div className="relative z-10">
                  <div className="bg-[#0B1021] rounded-xl p-4 md:p-5 border border-white/5 mb-5">
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      Tap below — your browser will ask for location permission. Tap <strong className="text-zinc-200">Allow</strong> to pinpoint your exact coordinates for satellite weather matching.
                    </p>
                  </div>
                  <button className="w-full bg-zinc-50 hover:bg-white text-black font-semibold text-sm py-3.5 md:py-4 rounded-xl flex justify-center items-center gap-2 transition-all active:scale-[0.98]">
                    <LocateFixed className="w-4 h-4" /> Detect My Location Automatically
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
                <div className="flex flex-col gap-4">
                  {/* Metric 1 */}
                  <div className="bg-[#0B1021] rounded-xl p-5 border border-white/5 relative overflow-hidden flex justify-between items-center group">
                    <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none"></div>
                    <div>
                      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-1 title-font flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" /> Daily Total
                      </p>
                      <p className="text-3xl font-display font-medium text-zinc-50 tracking-tight">
                        {dailyTotal.toFixed(1)} <span className="text-sm font-sans text-zinc-500 tracking-normal ml-1">kWh</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Metric 2 */}
                  <div className="bg-[#0B1021] rounded-xl p-5 border border-white/5 relative overflow-hidden flex justify-between items-center">
                    <div>
                      <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-1 title-font flex items-center gap-1.5">
                        <PanelTop className="w-3.5 h-3.5 text-indigo-400" /> Home Usage
                      </p>
                      <p className="text-3xl font-display font-medium text-zinc-50 tracking-tight">
                        {dailyHomeUsage.toFixed(1)} <span className="text-sm font-sans text-zinc-500 tracking-normal ml-1">kWh/day</span>
                      </p>
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="bg-[#0B1021] rounded-xl p-5 border border-white/5 relative overflow-hidden flex justify-between items-center">
                    <div>
                       <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-1 title-font flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Battery At EOD
                      </p>
                      <p className="text-3xl font-display font-medium text-zinc-50 tracking-tight">
                        {batteryAfterToday.toFixed(0)} <span className="text-sm font-sans text-zinc-500 tracking-normal ml-1">%</span>
                      </p>
                    </div>
                  </div>
                </div>
              </Card3D>

              {/* 4. SOLAR PROFILE CHART */}
              <Card3D title="Solar Profile" step="4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="text-left">
                    <h3 className="text-zinc-50 font-display font-medium text-lg">Estimated Output <span className="text-zinc-500 font-sans text-sm">- LAGOS</span></h3>
                    <p className="text-zinc-400 text-xs mt-1">{chartView === 'daily' ? 'Typical daily generation profile' : '7-day generation forecast'}</p>
                  </div>
                  <div className="flex bg-[#0B1021] p-1 rounded-lg border border-white/5">
                    <button 
                      onClick={() => setChartView('daily')}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-all ${chartView === 'daily' ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      Daily
                    </button>
                    <button 
                      onClick={() => setChartView('weekly')}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-all ${chartView === 'weekly' ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-500 hover:text-zinc-300'}`}
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
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.5} />
                      <XAxis dataKey="time" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                      <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => val.toFixed(1)} />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: '#0a0a0a', 
                          border: '1px solid #27272a', 
                          borderRadius: '8px', 
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          color: '#fafafa'
                        }}
                        itemStyle={{ color: '#fafafa', fontWeight: '500' }}
                        labelStyle={{ color: '#a1a1aa', marginBottom: '4px', fontSize: '11px' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#a1a1aa', paddingTop: '20px' }}/>
                      <Area 
                        type="monotone" 
                        dataKey="output" 
                        name="Solar Output (kW)"
                        stroke="#06b6d4" 
                        strokeWidth={2} 
                        fillOpacity={1} 
                        fill="url(#colorOutput)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card3D>

              {/* 5. LOG READINGS */}
              <div className="space-y-6">
                <Card3D title="Add Today's Reading" step="+" className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pl-1">Date</label>
                      <input type="date" className="w-full bg-[#0B1021] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-zinc-300 font-medium focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-zinc-700" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pl-1">Time</label>
                      <input type="time" defaultValue="08:00" className="w-full bg-[#0B1021] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-zinc-300 font-medium focus:outline-none focus:border-cyan-500/50 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pl-1">Solar Output (kWh)</label>
                      <input type="number" placeholder="e.g. 4.5" className="w-full bg-[#0B1021] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-zinc-300 font-medium focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-zinc-700" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pl-1">Battery Start (%)</label>
                      <input type="number" placeholder="e.g. 45" className="w-full bg-[#0B1021] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-zinc-300 font-medium focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-zinc-700" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pl-1">Battery End (%)</label>
                      <input type="number" placeholder="e.g. 85" className="w-full bg-[#0B1021] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-zinc-300 font-medium focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-zinc-700" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pl-1">Home Usage (kWh)</label>
                      <input type="number" placeholder="e.g. 3.2" className="w-full bg-[#0B1021] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-zinc-300 font-medium focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-zinc-700" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pl-1">Temperature (°C)</label>
                      <input type="number" placeholder="e.g. 32" className="w-full bg-[#0B1021] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-zinc-300 font-medium focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-zinc-700" />
                    </div>
                    <div className="flex flex-col gap-2 lg:col-span-2">
                      <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pl-1">Weather</label>
                      <select className="w-full bg-[#0B1021] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-zinc-400 font-medium focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none">
                        <option>Select...</option>
                        <option>Sunny</option>
                        <option>Partly Cloudy</option>
                        <option>Cloudy</option>
                        <option>Rainy</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mb-8">
                    <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pl-1">Notes (Optional)</label>
                    <input type="text" placeholder="e.g. Generator ran for 2hrs, load shedding..." className="w-full bg-[#0B1021] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-zinc-300 font-medium focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-zinc-700" />
                  </div>
                  <div className="flex gap-4 items-center">
                    <button className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 text-black font-semibold text-sm uppercase tracking-widest py-4 rounded-xl flex justify-center items-center shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all active:scale-[0.98]">
                      + Save Reading
                    </button>
                    <button className="bg-[#0B1021] hover:bg-[#121A30] text-zinc-300 font-semibold text-sm px-6 py-4 rounded-xl border border-white/5 transition-all flex items-center gap-2">
                       <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div> Use Now
                    </button>
                  </div>
                </Card3D>
                
                <Card3D title="Your Data Summary" step={<Database className="w-3.5 h-3.5" />}>
                   <div className="bg-[#0B1021] rounded-2xl p-10 border border-white/5 flex flex-col items-center justify-center text-center">
                     <div className="w-12 h-12 bg-[#020617] border border-white/5 rounded-xl flex items-center justify-center mb-4">
                       <Database className="w-5 h-5 text-zinc-600" />
                     </div>
                     <p className="text-zinc-400 text-sm font-medium mb-1">No readings yet.</p>
                     <p className="text-zinc-600 text-xs">Add your first reading above to get started.</p>
                   </div>
                </Card3D>
                
                <Card3D title="Why Log Your Data?" step={<Info className="w-3.5 h-3.5" />}>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    The AI model is initialized with estimated regional data. By logging your <strong className="text-zinc-200">real panel readings</strong>, predictions become precisely tailored to your local environment, occlusion patterns, and hardware degradation.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-500" strokeWidth={3} />
                      </div>
                      <p className="text-zinc-400 text-sm">Read your inverter display morning and evening</p>
                    </div>
                     <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-500" strokeWidth={3} />
                      </div>
                      <p className="text-zinc-400 text-sm">Takes less than 1 minute per day</p>
                    </div>
                     <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-500" strokeWidth={3} />
                      </div>
                      <p className="text-zinc-400 text-sm">Fine-tunes the model significantly over 2 weeks</p>
                    </div>
                     <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-500" strokeWidth={3} />
                      </div>
                      <p className="text-zinc-400 text-sm">Data is saved securely in your browser</p>
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
