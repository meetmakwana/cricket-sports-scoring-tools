
import React from 'react';

interface ScoreboardProps {
  runs: number;
  wickets: number;
  overs: string;
  onReset: () => void;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ runs, wickets, overs, onReset }) => {
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
          onClick={onReset}
          className="mb-4 text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-300"
        >
          RESET
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
