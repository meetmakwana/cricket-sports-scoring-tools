import React from 'react';
import { BallType } from '../types';

interface ControlsProps {
  onAction: (runs: number, type: BallType, isWicket: boolean) => void;
}

const Controls: React.FC<ControlsProps> = ({ onAction }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Row 1 */}
      <button 
        onClick={() => onAction(0, BallType.NORMAL, false)}
        className="btn-press aspect-[1.3/1] bg-[#222E26] rounded-2xl flex flex-col items-center justify-center border border-white/5 shadow-md"
      >
        <span className="text-3xl font-black text-white">0</span>
        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-0.5">Dot</span>
      </button>
      <button 
        onClick={() => onAction(1, BallType.NORMAL, false)}
        className="btn-press aspect-[1.3/1] bg-[#222E26] rounded-2xl flex items-center justify-center border border-white/5 shadow-md"
      >
        <span className="text-3xl font-black text-white">1</span>
      </button>
      <button 
        onClick={() => onAction(2, BallType.NORMAL, false)}
        className="btn-press aspect-[1.3/1] bg-[#222E26] rounded-2xl flex items-center justify-center border border-white/5 shadow-md"
      >
        <span className="text-3xl font-black text-white">2</span>
      </button>

      {/* Row 2 */}
      <button 
        onClick={() => onAction(3, BallType.NORMAL, false)}
        className="btn-press aspect-[1.3/1] bg-[#222E26] rounded-2xl flex items-center justify-center border border-white/5 shadow-md"
      >
        <span className="text-3xl font-black text-white">3</span>
      </button>
      <button 
        onClick={() => onAction(4, BallType.NORMAL, false)}
        className="btn-press aspect-[1.3/1] bg-[#10B981] neon-glow-green rounded-2xl flex items-center justify-center shadow-lg"
      >
        <span className="text-4xl font-black text-black">4</span>
      </button>
      <button 
        onClick={() => onAction(6, BallType.NORMAL, false)}
        className="btn-press aspect-[1.3/1] bg-[#10B981] neon-glow-green rounded-2xl flex items-center justify-center shadow-lg"
      >
        <span className="text-4xl font-black text-black">6</span>
      </button>

      {/* Row 3 */}
      <button 
        onClick={() => onAction(0, BallType.WIDE, false)}
        className="btn-press aspect-[1.3/1] bg-[#3B2B15] rounded-2xl flex flex-col items-center justify-center border border-white/5 shadow-md"
      >
        <span className="text-2xl font-black text-[#F59E0B]">WD</span>
        <span className="text-[9px] font-black text-[#F59E0B]/50 uppercase tracking-widest mt-0.5">Wide</span>
      </button>
      <button 
        onClick={() => onAction(0, BallType.NO_BALL, false)}
        className="btn-press aspect-[1.3/1] bg-[#3B2B15] rounded-2xl flex flex-col items-center justify-center border border-white/5 shadow-md"
      >
        <span className="text-2xl font-black text-[#F59E0B]">NB</span>
        <span className="text-[9px] font-black text-[#F59E0B]/50 uppercase tracking-widest mt-0.5">No Ball</span>
      </button>
      <button 
        onClick={() => onAction(0, BallType.NORMAL, true)}
        className="btn-press aspect-[1.3/1] bg-[#EF4444] rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-rose-950/20"
      >
        <span className="text-2xl font-black text-white uppercase tracking-tighter">OUT</span>
        <span className="text-[9px] font-black text-white/60 uppercase tracking-widest mt-0.5">Wicket</span>
      </button>
    </div>
  );
};

export default Controls;