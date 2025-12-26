import React from 'react';
import { BallType } from '../types';

interface ControlsProps {
  onAction: (runs: number, type: BallType, isWicket: boolean) => void;
  onUndo: () => void;
  canUndo: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onAction, onUndo, canUndo }) => {
  const runButtons = [0, 1, 2, 3];
  const majorRuns = [4, 6];

  return (
    <div className="flex flex-col gap-4">
      {/* 4-Column Grid for Singles/Dots */}
      <div className="grid grid-cols-4 gap-3">
        {runButtons.map(r => (
          <button
            key={r}
            onClick={() => onAction(r, BallType.NORMAL, false)}
            className="btn-press aspect-square bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center justify-center hover:bg-slate-800 shadow-lg"
          >
            <span className="text-3xl font-black text-white leading-none">{r}</span>
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Runs</span>
          </button>
        ))}
      </div>

      {/* High Impact Row: Boundaries and Wickets */}
      <div className="grid grid-cols-3 gap-3">
        {majorRuns.map(r => (
          <button
            key={r}
            onClick={() => onAction(r, BallType.NORMAL, false)}
            className="btn-press aspect-[1.4/1] bg-emerald-600 border border-emerald-400/20 rounded-3xl flex flex-col items-center justify-center shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
          >
            <span className="text-4xl font-black text-white leading-none">{r}</span>
            <span className="text-[10px] text-emerald-100 font-black uppercase tracking-widest mt-1">Boundary</span>
          </button>
        ))}
        
        <button
          onClick={() => onAction(0, BallType.NORMAL, true)}
          className="btn-press aspect-[1.4/1] bg-rose-600 border border-rose-400/20 rounded-3xl flex flex-col items-center justify-center shadow-[0_10px_20px_rgba(225,29,72,0.2)]"
        >
          <span className="text-2xl font-black text-white leading-none uppercase">Out</span>
          <span className="text-[10px] text-rose-100 font-black uppercase tracking-widest mt-1">Wicket</span>
        </button>
      </div>

      {/* Utilities Row: Extras and Undo */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onAction(0, BallType.WIDE, false)}
          className="btn-press py-4 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex flex-col items-center"
        >
          <span className="text-sm font-black text-indigo-300 uppercase tracking-widest">Wide</span>
          <span className="text-[9px] text-indigo-500/70 font-black">+1 Extra</span>
        </button>

        <button
          onClick={() => onAction(0, BallType.NO_BALL, false)}
          className="btn-press py-4 bg-amber-600/20 border border-amber-500/30 rounded-2xl flex flex-col items-center"
        >
          <span className="text-sm font-black text-amber-300 uppercase tracking-widest">No Ball</span>
          <span className="text-[9px] text-amber-500/70 font-black">+1 Extra</span>
        </button>

        <button
          disabled={!canUndo}
          onClick={onUndo}
          className={`btn-press py-4 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
              canUndo 
              ? 'bg-slate-800 border-slate-700 text-slate-300' 
              : 'bg-slate-900/30 border-transparent text-slate-700'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">Undo</span>
        </button>
      </div>
    </div>
  );
};

export default Controls;