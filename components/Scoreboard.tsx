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
    <div className="glass-panel rounded-[2.5rem] p-6 relative overflow-hidden group">
      {/* Decorative pulse element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all duration-700"></div>
      
      <div className="flex flex-row justify-between items-center relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Current Score</span>
          <div className="flex flex-row items-baseline gap-1">
            <h1 className="text-7xl font-black text-white leading-none tracking-tighter score-font drop-shadow-2xl">
              {runs}
            </h1>
            <span className="text-3xl font-light text-slate-700 mx-1">/</span>
            <span className="text-5xl font-black text-rose-500 leading-none score-font">{wickets}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-5">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            className={`btn-press text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-widest border transition-all ${
              isConfirmingReset 
                ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_20px_rgba(225,29,72,0.4)] animate-pulse' 
                : 'bg-slate-800 text-slate-400 border-white/5'
            }`}
          >
            {isConfirmingReset ? 'Tap to Confirm' : 'Reset Match'}
          </button>
          
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.2em] mb-1">Overs Finished</span>
            <div className="bg-slate-950/80 px-4 py-1.5 rounded-2xl border border-white/5 shadow-inner">
              <span className="text-3xl font-mono font-black text-emerald-400 leading-none">
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