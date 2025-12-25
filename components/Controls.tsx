
import React from 'react';
import { BallType } from '../types';

interface ControlsProps {
  onAction: (runs: number, type: BallType, isWicket: boolean) => void;
  onUndo: () => void;
  canUndo: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onAction, onUndo, canUndo }) => {
  const runButtons = [0, 1, 2, 3, 4, 6];

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Runs Buttons */}
      {runButtons.map(r => (
        <button
          key={r}
          onClick={() => onAction(r, BallType.NORMAL, false)}
          className="aspect-square flex flex-col items-center justify-center bg-slate-700 active:bg-slate-600 rounded-2xl border-b-4 border-slate-800 transition-all active:border-b-0 active:translate-y-1"
        >
          <span className="text-3xl font-black">{r}</span>
          <span className="text-[10px] text-slate-400 uppercase font-bold">Runs</span>
        </button>
      ))}

      {/* Special Buttons */}
      <button
        onClick={() => onAction(0, BallType.WIDE, false)}
        className="aspect-square flex flex-col items-center justify-center bg-blue-600 active:bg-blue-500 rounded-2xl border-b-4 border-blue-800 transition-all active:border-b-0 active:translate-y-1"
      >
        <span className="text-2xl font-black">WD</span>
        <span className="text-[10px] text-blue-200 uppercase font-bold">+1 Extra</span>
      </button>

      <button
        onClick={() => onAction(0, BallType.NO_BALL, false)}
        className="aspect-square flex flex-col items-center justify-center bg-orange-600 active:bg-orange-500 rounded-2xl border-b-4 border-orange-800 transition-all active:border-b-0 active:translate-y-1"
      >
        <span className="text-2xl font-black">NB</span>
        <span className="text-[10px] text-orange-200 uppercase font-bold">+1 Extra</span>
      </button>

      <button
        onClick={() => onAction(0, BallType.NORMAL, true)}
        className="aspect-square flex flex-col items-center justify-center bg-red-700 active:bg-red-600 rounded-2xl border-b-4 border-red-900 transition-all active:border-b-0 active:translate-y-1"
      >
        <span className="text-2xl font-black">OUT</span>
        <span className="text-[10px] text-red-200 uppercase font-bold">Wicket</span>
      </button>

      {/* Utilities */}
      <button
        disabled={!canUndo}
        onClick={onUndo}
        className={`col-span-3 py-4 flex items-center justify-center rounded-xl border-b-4 transition-all active:border-b-0 active:translate-y-1 ${
            canUndo ? 'bg-slate-600 border-slate-800 active:bg-slate-500' : 'bg-slate-800 border-transparent opacity-30'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <span className="font-bold uppercase tracking-widest text-sm">Undo Last Ball</span>
      </button>
    </div>
  );
};

export default Controls;
