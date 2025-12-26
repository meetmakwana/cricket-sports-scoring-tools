import React from 'react';

interface ScoreboardProps {
  runs: number;
  wickets: number;
  overs: string;
  crr: string;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ runs, wickets, overs, crr }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-baseline mb-6">
        <span className="text-[96px] font-black leading-none tracking-tighter text-white">
          {runs}
        </span>
        <span className="text-[84px] font-black leading-none tracking-tighter text-[#10B981]/40 mx-2 transform skew-x-[-15deg]">
          /
        </span>
        <span className="text-[96px] font-black leading-none tracking-tighter text-white">
          {wickets}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="pill border-[#10B981]/20">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest pt-0.5">Overs</span>
          <span className="text-lg font-black text-[#10B981] tracking-tighter">{overs}</span>
        </div>
        <div className="pill border-white/5">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest pt-0.5">CRR</span>
          <span className="text-lg font-black text-white/90 tracking-tighter">{crr}</span>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;