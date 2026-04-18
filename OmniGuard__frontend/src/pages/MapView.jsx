import React from 'react';
import TacticalMap from '../components/TacticalMap';
import { Shield, MapPin, Layers, Radio } from 'lucide-react';

export default function MapView({ incidents }) {
  return (
    <div className="flex flex-col h-full -m-6 md:-m-8 relative"> {/* Added relative for predictable overlay positioning */}
      {/* Map Header Overlay */}
      <div className="absolute top-12 left-12 z-20 flex flex-row items-start gap-4 pointer-events-none">
        <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-4 pointer-events-auto transition-all hover:scale-105">
          <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/30">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-none">TACTICAL_VIEW</h2>
            <p className="text-[10px] font-mono text-emerald-600 uppercase tracking-widest mt-1">Status: Active Monitor</p>
          </div>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-800 flex flex-col gap-3 pointer-events-auto">
          <div className="flex items-center gap-3 text-white">
             <Radio size={16} className="text-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-widest">Live Broadcast</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-1 bg-emerald-500/50 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Map Controls Overlay (Right) */}
      <div className="absolute top-[160px] right-12 z-10 flex flex-col gap-3">
        <button className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-lg transition-all active:scale-95 group">
          <Layers size={20} className="text-slate-500 group-hover:text-emerald-500" />
        </button>
        <button className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-lg transition-all active:scale-95 group">
          <MapPin size={20} className="text-slate-500 group-hover:text-emerald-500" />
        </button>
      </div>

      {/* Full Height Map Container */}
      <div className="flex-1 w-full h-[calc(100vh-8rem)] relative overflow-hidden bg-slate-900">
        <TacticalMap incidents={incidents} />
      </div>

      {/* Legend Footer */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full shadow-2xl flex items-center gap-8 z-10">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">High Threat</span>
         </div>
         <div className="flex items-center gap-2 border-l border-slate-200 pl-8">
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Dispatched</span>
         </div>
         <div className="flex items-center gap-2 border-l border-slate-200 pl-8">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Assets Standby</span>
         </div>
      </div>
    </div>
  );
}
