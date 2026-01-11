import { useEffect } from 'react';
import { GlassCard } from './components/GlassCard';
import {
  Home, Activity, Calendar, Settings, User,
  ChevronLeft, ChevronRight, Search, Plus,
  Flame, Heart, Footprints, Moon, MoreHorizontal,
  Cloud, RefreshCw
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { useFitnessStore } from './stores/useFitnessStore';
import { orchestrator } from './services/orchestrator';

const IconMap: Record<string, any> = { Flame, Heart, Footprints, Moon };

function App() {
  const {
    activities, stats, dietPlan, biometrics, schedule, synced
  } = useFitnessStore();

  useEffect(() => {
    // Initial data pull
    orchestrator.pullFromCloud();
  }, []);

  const handleManualSync = () => {
    orchestrator.pushToCloud();
  };

  return (
    // Background Room Image
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center p-8 overflow-hidden font-sans text-gray-800"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2674&auto=format&fit=crop")' }}
    >

      {/* --- FLOATING SIDEBAR (LEFT) --- */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-50">
        <div className="h-full bg-white/20 backdrop-blur-2xl border border-white/30 rounded-full py-6 px-3 flex flex-col items-center justify-between shadow-2xl">
          <div className="text-orange-500 mb-6"><Activity size={28} /></div>
          <div className="flex flex-col gap-8 text-white/80">
            <Home size={24} className="text-white bg-orange-500/80 p-1 rounded-lg box-content cursor-pointer transition transform hover:scale-110" />
            <Activity size={24} className="cursor-pointer hover:text-white transition transform hover:scale-110" />
            <Calendar size={24} className="cursor-pointer hover:text-white transition transform hover:scale-110" />
            <div className="h-px w-8 bg-white/20"></div>
            <User size={24} className="cursor-pointer hover:text-white transition transform hover:scale-110" />
            <Settings size={24} className="cursor-pointer hover:text-white transition transform hover:scale-110" />
          </div>
          <div className="mt-6">
            <div onClick={handleManualSync} className="cursor-pointer hover:scale-110 transition active:scale-95">
              {synced ? <Cloud size={24} className="text-green-400" /> : <RefreshCw size={24} className="animate-spin text-orange-400" />}
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN GLASS WINDOW --- */}
      <div className="w-full max-w-[1400px] h-[90vh] bg-white/20 backdrop-blur-3xl border border-white/30 rounded-[40px] shadow-2xl overflow-hidden flex flex-col ml-20 relative">

        {/* TOP BROWSER BAR */}
        <div className="h-16 border-b border-white/20 flex items-center px-6 justify-between shrink-0">
          <div className="flex gap-4 text-white/70">
            <div className="p-2 bg-black/10 rounded-full cursor-pointer hover:bg-black/20"><ChevronLeft size={18} /></div>
            <div className="p-2 bg-black/10 rounded-full cursor-pointer hover:bg-black/20"><ChevronRight size={18} /></div>
          </div>
          <div className="flex-1 max-w-xl mx-8 bg-black/10 rounded-full h-9 flex items-center px-4 text-white/60 text-sm">
            <span className="mx-auto flex items-center gap-2">fitness.com</span>
          </div>
          <div className="flex gap-3 text-white/70">
            <Plus size={20} className="cursor-pointer hover:text-white" />
            <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center cursor-pointer hover:bg-black/30">
              <span className="text-xs">Tab</span>
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="flex flex-1 overflow-hidden">

          {/* MIDDLE DASHBOARD AREA */}
          <div className="flex-[3] p-8 overflow-y-auto custom-scrollbar">

            {/* Greeting Header */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-semibold text-white mb-1">Good Morning, Lionel 👋</h1>
                <p className="text-white/60 text-sm">Let's do some workout today</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-white/50" size={18} />
                <input type="text" placeholder="Search metrics..." className="bg-black/10 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none w-64 backdrop-blur-sm" />
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {stats.map((stat, i) => {
                const Icon = IconMap[stat.icon] || Activity;
                return (
                  <GlassCard key={i} className="flex flex-col justify-between h-32 bg-white/60 group hover:bg-white/70">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                      <Icon size={18} className={`${stat.color} group-hover:scale-110 transition`} />
                    </div>
                    <div>
                      <div className="h-8 flex items-end gap-1 mb-2 opacity-30">
                        {[...Array(6)].map((_, j) => <div key={j} className={`w-1 rounded-full bg-current ${stat.color}`} style={{ height: (Math.sin(j + i) * 10 + 15) + 'px' }}></div>)}
                      </div>
                      <h3 className={`text-xl font-bold ${stat.color}`}>{stat.val}</h3>
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            {/* Main Activity Section */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* Chart */}
              <GlassCard className="col-span-2 h-72 bg-white/60 flex flex-col">
                <div className="flex justify-between mb-4 px-2">
                  <h3 className="font-semibold text-gray-800">Activity Tracking</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${synced ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{synced ? 'Synced' : 'Syncing...'}</span>
                  </div>
                </div>
                <div className="flex-1 w-full p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activities}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff8c42" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ff8c42" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Tooltip cursor={false} contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '12px', border: 'none' }} />
                      <Area type="monotone" dataKey="value" stroke="#ff8c42" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Running Card */}
              <GlassCard className="col-span-1 h-72 bg-white/70 relative overflow-hidden group cursor-pointer" onClick={handleManualSync}>
                <img src="https://images.unsplash.com/photo-1552674605-469523f54050?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" alt="run" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg w-2/3 leading-tight">Running with resistance band</h3>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">12 <span className="text-sm font-normal text-gray-600">km</span></div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Click to Sync Progress</div>
                    <div className="w-full h-1 bg-black/10 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 w-3/4"></div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Diet Plan Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 border-l-4 border-orange-500 pl-3">
                  <h3 className="text-lg font-semibold text-white">Diet Plan</h3>
                </div>
                <span className="text-xs text-white/50 cursor-pointer hover:text-white transition">view all</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {dietPlan.map((diet, i) => (
                  <GlassCard key={i} className={`p-3 flex gap-3 items-center cursor-pointer transition-all hover:scale-[1.02] ${diet.active ? 'bg-orange-400 text-white shadow-[0_0_20px_rgba(255,140,66,0.3)]' : 'bg-white/80'}`}>
                    <div className={`w-14 h-14 rounded-full overflow-hidden shrink-0 ${diet.active ? 'border-2 border-white/50' : ''}`}>
                      <img src={diet.image} className="w-full h-full object-cover" alt={diet.name} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm tracking-tight">{diet.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${diet.active ? 'bg-white/20' : 'bg-orange-100 text-orange-600'}`}>{diet.day}</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR (PROFILE & CALENDAR) */}
          <div className="flex-1 bg-black/20 backdrop-blur-md p-6 border-l border-white/10 flex flex-col gap-6 text-white overflow-y-auto custom-scrollbar">

            {/* Profile Header */}
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e" className="w-12 h-12 rounded-xl object-cover border-2 border-white/20" />
                <div>
                  <h4 className="font-bold">Lionel Messi</h4>
                  <p className="text-xs text-white/50">@itsworks</p>
                </div>
              </div>
              <MoreHorizontal className="text-white/50 cursor-pointer hover:text-white" />
            </div>

            {/* Personal Stats */}
            <div className="flex justify-between bg-white/10 p-4 rounded-2xl">
              <div className="text-center">
                <div className="font-bold">{biometrics.weight}</div>
                <div className="text-[10px] text-white/50">Weight</div>
              </div>
              <div className="text-center border-x border-white/10 px-4">
                <div className="font-bold">{biometrics.height}</div>
                <div className="text-[10px] text-white/50">Height</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{biometrics.age}</div>
                <div className="text-[10px] text-white/50">Age</div>
              </div>
            </div>

            {/* Calendar (Mock) */}
            <div>
              <h4 className="mb-4 text-sm font-semibold">December 2022</h4>
              <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-white/60">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                <span className="opacity-30">29</span><span className="opacity-30">30</span>
                {[...Array(31)].map((_, i) => (
                  <span key={i} className={`p-1 rounded-full cursor-pointer hover:bg-white/10 transition-colors ${i + 1 === 17 ? 'bg-green-500 text-white' : i + 1 === 23 ? 'bg-orange-500 text-white' : ''}`}>
                    {i + 1}
                  </span>
                ))}
              </div>
            </div>

            {/* Scheduled List */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-sm">Scheduled</span>
                <span className="text-xs text-white/50 cursor-pointer hover:text-white transition">view all</span>
              </div>
              <div className="space-y-3">
                {schedule.map((item, i) => (
                  <div key={i} className="flex gap-3 bg-white/5 p-3 rounded-xl hover:bg-white/10 transition cursor-pointer group">
                    <img src={item.image} className="w-10 h-10 rounded-lg object-cover group-hover:scale-105 transition" />
                    <div>
                      <div className="text-xs text-orange-400 font-bold mb-0.5">{item.category}</div>
                      <div className="text-sm font-medium tracking-tight">{item.title}</div>
                      <div className="text-[10px] text-white/40">{item.dates}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
