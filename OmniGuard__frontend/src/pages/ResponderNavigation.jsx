import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation, CheckCircle, AlertTriangle, MapPin, Radio, Activity } from 'lucide-react';
import TacticalMap from '../components/TacticalMap';

export default function ResponderNavigation({ user, incidents = [], onUpdateStatus }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Find incident: either from state or the most recent active assignment for this team
  const incident = location.state?.incident || 
    incidents
      .filter(inc => inc.assignedTeam === user?.responderTeam && inc.status !== 'Resolved')
      .sort((a, b) => (b.createdAt?._seconds || 0) - (a.createdAt?._seconds || 0))[0] ||
    { id: 'T-SYNC', type: 'No Active Assignment', location: 'Awaiting Dispatch', lat: 26.1445, lng: 91.7362, status: 'Idle', severity: 'Low' };

  const handleStatusUpdate = (status) => {
    if (onUpdateStatus && incident.id !== 'T-SYNC') {
      onUpdateStatus(incident.id, status);
    }
  };

  const handleResolve = () => {
    if (onUpdateStatus && incident.id !== 'T-SYNC') {
      onUpdateStatus(incident.id, 'Resolved');
    }
    navigate('/incidents');
  };

  return (
    <div className="flex flex-col h-full gap-6">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
             <Navigation className="text-emerald-500" />
             Tactical Navigation
          </h2>
          <p className="text-slate-500 font-medium">Real-time GPS routing to {incident.id}</p>
        </div>
        <div className="flex gap-4">
           <div className="px-5 py-2 bg-slate-900 text-white rounded-xl border border-slate-800 flex items-center gap-3 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Telemetry: Online</span>
           </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Column */}
        <div className="lg:col-span-8 bg-slate-100 rounded-[2.5rem] border-2 border-slate-200 relative overflow-hidden shadow-inner group">
          <div className="absolute inset-0 z-0">
             <TacticalMap incidents={[{ ...incident, lat: incident.lat || 26.1445, lng: incident.lng || 91.7362 }]} />
          </div>

          {/* Map Overlay HUD */}
          <div className="absolute top-6 left-[72px] z-10 w-full max-w-md">
             <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/50 flex items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                   <div className="bg-emerald-500 p-4 rounded-2xl text-white shadow-xl shadow-emerald-500/40 shrink-0">
                      <Navigation size={28} />
                   </div>
                   <div className="min-w-0">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Routing Instruction</p>
                      <p className="font-black text-slate-900 text-lg truncate">350m - Turn Right at Beltola Chowk</p>
                   </div>
                </div>
                <div className="text-right border-l border-slate-100 pl-8 shrink-0">
                   <p className="text-3xl font-black text-slate-900 leading-none">4 MIN</p>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Est. Arrival</p>
                </div>
             </div>
          </div>
        </div>

        {/* Controls Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-xl flex-1">
              <div className="flex items-center gap-3 mb-8">
                 <Activity className="text-emerald-500" />
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Mission Control</h3>
              </div>

              <div className="space-y-4 mb-10">
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Current Sector</p>
                    <p className="font-bold text-slate-900">ALPHA_DENSE_02</p>
                 </div>
                 <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-600 uppercase">Assigned Incident</p>
                    <p className="font-black text-slate-900 uppercase">{incident.type}</p>
                 </div>
              </div>

              <div className="space-y-3">
                 <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1 mb-4">Update Pulse Status</p>
                 <button onClick={() => handleStatusUpdate('En Route')} className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                    <Radio size={16} />
                    Signal: In Transit
                 </button>
                 <button onClick={() => handleStatusUpdate('On Scene')} className="w-full py-4 bg-amber-500 text-white font-black rounded-2xl shadow-xl shadow-amber-500/20 hover:bg-amber-600 transition-all active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                    <Activity size={16} />
                    Signal: On Scene
                 </button>
                 <div className="h-6" />
                 <button onClick={handleResolve} className="w-full py-5 bg-emerald-500 text-white font-black rounded-[1.5rem] shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg uppercase tracking-tighter">
                    <CheckCircle size={26} />
                    MISSION RESOLVED
                 </button>
                 <button className="w-full py-3 bg-transparent text-rose-500 font-bold rounded-2xl hover:bg-rose-50 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest opacity-60 hover:opacity-100">
                    <AlertTriangle size={14} />
                    Emergency Override
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
