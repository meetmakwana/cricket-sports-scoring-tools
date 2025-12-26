import React from 'react';

const PlayerStats: React.FC = () => {
  return (
    <div className="bg-[#16211B] rounded-3xl p-6 flex border border-white/5">
      {/* Striker */}
      <div className="flex-1">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Striker</span>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xl font-black text-white">Rahul</span>
          <span className="text-[#22C55E] text-xl font-black">*</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400 font-bold">
          <span className="text-sm">24</span>
          <span className="text-xs font-medium text-slate-600">(12)</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px bg-white/5 mx-2 my-2"></div>

      {/* Non-Striker */}
      <div className="flex-1 pl-6">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Non-Striker</span>
        <div className="mb-1">
          <span className="text-xl font-black text-white">Sam</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400 font-bold">
          <span className="text-sm">10</span>
          <span className="text-xs font-medium text-slate-600">(8)</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;