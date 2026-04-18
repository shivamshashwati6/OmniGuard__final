import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, CheckCircle, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

const activeIncidents = [
  { id: 'INC-772', type: 'Medical Emergency', status: 'Dispatched', priority: 'High', location: 'Bhetapara, Guwahati', distance: '1.2km' },
  { id: 'INC-801', type: 'Fire Alert', status: 'On Site', priority: 'Critical', location: 'Beltola Market', distance: '3.5km' },
];

export default function IncidentResponseView() {
  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Incident Response Console</h2>
          <p className="text-slate-500 font-medium">Assigned field operations and real-time navigation</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-slate-700">DUTY ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Incident List */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Active Assignments</h3>
          {activeIncidents.map((incident) => (
            <motion.div
              key={incident.id}
              whileHover={{ scale: 1.02 }}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                incident.priority === 'Critical' ? 'bg-rose-50 border-rose-200 shadow-rose-100' : 'bg-white border-slate-100'
              } shadow-sm`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-black font-mono bg-slate-900 text-white px-2 py-0.5 rounded">
                  {incident.id}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  incident.priority === 'Critical' ? 'bg-rose-500 text-white' : 'bg-amber-100 text-amber-700'
                }`}>
                  {incident.priority}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-1">{incident.type}</h4>
              <p className="text-sm text-slate-500 flex items-center gap-1 mb-4">
                <MapPin size={14} /> {incident.location}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  <span className="text-xs text-slate-600 font-bold">{incident.distance} away</span>
                </div>
                <button className="text-xs font-bold text-emerald-600 hover:underline">View Details</button>
              </div>
            </motion.div>
          ))}
          
          <div className="mt-auto bg-slate-900 p-6 rounded-[2rem] text-white">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-emerald-400" />
              <h4 className="font-bold">Responder Safety</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Protocols indicate always waiting for secondary units if the hazard level is above Level-2.
            </p>
            <button className="w-full py-3 bg-emerald-500 text-slate-900 font-bold rounded-xl text-sm transition-transform active:scale-95">
              Emergency Comms
            </button>
          </div>
        </div>

        {/* Map View */}
        <div className="lg:col-span-2 bg-slate-100 rounded-[2.5rem] border border-slate-200 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/91.73,26.14,12,0/800x600?access_token=placeholder')] bg-cover bg-center">
             {/* Mock Map Background */}
             <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px]"></div>
          </div>
          
          {/* Navigation Overlay */}
          <div className="absolute top-6 left-6 right-6">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-500 p-3 rounded-xl text-white shadow-lg shadow-emerald-500/30">
                  <Navigation size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Routing to Incident</p>
                  <p className="font-bold text-slate-900">350m - Turn Right at Beltola Chowk</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-slate-900">4 MIN</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Est. Arrival</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3">
            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95 uppercase tracking-widest text-xs">
                In Transit
              </button>
              <button className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all active:scale-95 uppercase tracking-widest text-xs">
                On Scene
              </button>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-4 bg-emerald-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 active:scale-95">
                <CheckCircle size={24} />
                MARK AS RESOLVED
              </button>
              <button className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-rose-500 shadow-xl hover:bg-rose-50 transition-colors shrink-0">
                <AlertTriangle size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
