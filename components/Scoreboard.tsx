
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
    <div className="flex justify-between items-center">
      <div className="flex flex-col">
        <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Current Score</span>
        <div className="flex items-baseline gap-2">
          <h1 className="text-6xl font-black text-white tracking-tighter">{runs}</h1>
          <span className="text-4xl text-slate-500 font-light">/</span>
          <h2 className="text-4xl font-bold text-red-500">{wickets}</h2>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onReset();
          }}
          className={`mb-4 text-[10px] font-bold px-3 py-1.5 rounded transition-all duration-200 uppercase tracking-wider ${
            isConfirmingReset 
              ? 'bg-red-600 text-white animate-pulse ring-2 ring-red-400' 
              : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
          }`}
        >
          {isConfirmingReset ? 'CONFIRM?' : 'RESET'}
        </button>
        <div className="text-right">
          <span className="text-slate-400 text-xs font-bold uppercase block">Overs</span>
          <span className="text-4xl font-mono font-bold text-emerald-400 tracking-tight">{overs}</span>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
