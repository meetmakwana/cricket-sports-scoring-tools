import React from 'react';
import { BallType } from '../types';

interface ControlsProps {
  onAction: (runs: number, type: BallType, isWicket: boolean) => void;
  onUndo: () => void;
  canUndo: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onAction, onUndo, canUndo }) => {
  const runButtons = [0, 1, 2, 3];
  const boundaryButtons = [4, 6];

  return (
    <div className="space-y-4">
      {/* Standard Runs Grid */}
      <div className="grid grid-cols-4 gap-3">
        {runButtons.map(r => (
          <button
            key={r}
            onClick={() => onAction(r, BallType.NORMAL, false)}
            className="btn-press aspect-square bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center justify-center hover:bg-slate-800 transition-colors shadow-sm"
          >
            <span className="text-2xl font-black text-white">{r}</span>
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Runs</span>
          </button>
        ))}
      </div>

      {/* High-Contrast Action Grid */}
      <div className="grid grid-cols-3 gap-3">
        {boundaryButtons.map(r => (
          <button
            key={r}
            onClick={() => onAction(r, BallType.NORMAL, false)}
            className="btn-press aspect-[1.5/1] bg-emerald-600 rounded-3xl flex flex-col items-center justify-center shadow-[0_4px_15px_rgba(16,185,129,0.2)] border border-emerald-400/30"
          >
            <span className="text-3xl font-black text-white">{r}</span>
            <span className="text-[9px] text-emerald-100 font-black uppercase tracking-[0.2em]">Boundary</span>
          </button>
        ))}
        
        <button
          onClick={() => onAction(0, BallType.NORMAL, true)}
          className="btn-press aspect-[1.5/1] bg-rose-600 rounded-3xl flex flex-col items-center justify-center shadow-[0_4px_15px_rgba(225,29,72,0.2)] border border-rose-400/30"
        >
          <span className="text-xl font-black text-white leading-tight uppercase">Out</span>
          <span className="text-[9px] text-rose-100 font-black uppercase tracking-[0.2em]">Wicket</span>
        </button>
      </div>

      {/* Extras & Correction Row */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onAction(0, BallType.WIDE, false)}
          className="btn-press py-4 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex flex-col items-center"
        >
          <span className="text-sm font-black text-indigo-400 uppercase tracking-widest">Wide</span>
          <span className="text-[8px] text-indigo-500 font-bold">+1 Extra</span>
        </button>

        <button
          onClick={() => onAction(0, BallType.NO_BALL, false)}
          className="btn-press py-4 bg-amber-600/20 border border-amber-500/30 rounded-2xl flex flex-col items-center"
        >
          <span className="text-sm font-black text-amber-400 uppercase tracking-widest">No Ball</span>
          <span className="text-[8px] text-amber-500 font-bold">+1 Extra</span>
        </button>

        <button
          disabled={!canUndo}
          onClick={onUndo}
          className={`btn-press py-4 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
              canUndo 
              ? 'bg-slate-800 border-slate-700 text-slate-300' 
              : 'bg-slate-900/30 border-slate-900 text-slate-700 opacity-50'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="text-[8px] font-black uppercase tracking-tighter">Undo</span>
        </button>
      </div>
    </div>
  );
};

export default Controls;