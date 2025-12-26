import React from 'react';

interface ScoreboardProps {
  runs: number;
  wickets: number;
  overs: string;
  onReset: () => void;
  isConfirmingReset?: boolean;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ runs, wickets, overs, onReset, isConfirmingReset }) => {
  return (
    <div className="glass-card rounded-[2.5rem] p-6 relative overflow-hidden ring-1 ring-white/10">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
      
      <div className="flex justify-between items-center relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1 ml-1">Total Score</span>
          <div className="flex items-center gap-1">
            <h1 className="text-7xl font-black text-white leading-none tracking-tighter tabular-nums drop-shadow-sm">
              {runs}
            </h1>
            <div className="flex flex-col -mt-2">
              <span className="text-4xl font-light text-slate-700 leading-none">/</span>
              <span className="text-4xl font-black text-rose-500 leading-none tabular-nums">{wickets}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            className={`btn-press text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest border transition-all duration-300 ${
              isConfirmingReset 
                ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_20px_rgba(225,29,72,0.4)]' 
                : 'bg-slate-800/50 hover:bg-slate-700 text-slate-400 border-white/5'
            }`}
          >
            {isConfirmingReset ? 'Tap Again?' : 'Reset'}
          </button>
          
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.2em] mb-1">Overs</span>
            <div className="bg-slate-950/80 px-4 py-1.5 rounded-2xl border border-white/5">
              <span className="text-2xl font-mono font-black text-emerald-400 tabular-nums">
                {overs}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;