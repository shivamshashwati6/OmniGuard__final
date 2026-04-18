import React from 'react'
import { Bell, Search, User, Zap, Wifi, Clock, ShieldCheck, Menu } from 'lucide-react'

export default function TopNav({ user, toggleSidebar }) {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
      <div className="flex items-center gap-4 md:gap-6">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:flex items-center gap-4 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tactical database..." 
            className="bg-transparent border-none text-xs focus:outline-none text-slate-600 placeholder:text-slate-400 w-48"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Status Indicators */}
        <div className="hidden lg:flex items-center gap-6 mr-6 border-r border-slate-100 pr-6">
          <div className="flex items-center gap-2">
            <Wifi size={14} className="text-emerald-500" />
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Network_Stable</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-emerald-500" />
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">T-SYNC ACTIVE</span>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-rose-500 text-white px-5 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-colors">
          <Zap size={18} fill="currentColor" />
          Quick SOS
        </button>

        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors group">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white group-hover:animate-ping"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-100 ml-2">
          <div className="text-right flex flex-col items-end">
            <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">{user?.name || 'Operator ID'}</p>
            <p className="text-[9px] text-emerald-500 font-mono uppercase font-bold">{user?.role || 'Guest'} Access</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:border-emerald-500 transition-colors overflow-hidden">
             {user?.role === 'coordinator' ? <ShieldCheck className="text-emerald-500" size={24} /> : <User className="text-slate-400" size={24} />}
          </div>
        </div>
      </div>
    </header>
  )
}
