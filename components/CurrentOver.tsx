import React from 'react';
import { BallRecord, BallType } from '../types';

interface CurrentOverProps {
  history: BallRecord[];
}

const CurrentOver: React.FC<CurrentOverProps> = ({ history }) => {
  const getBallClass = (ball: BallRecord) => {
    if (ball.isWicket) return "bg-rose-900/30 text-rose-500 border border-rose-500/30";
    if (ball.runs === 4 || ball.runs === 6) return "bg-[#10B981] text-black neon-glow-green";
    if (ball.type !== BallType.NORMAL) return "bg-[#3B2B15] text-[#F59E0B] border border-[#F59E0B]/20";
    return "bg-[#1F2923] text-white/60 border border-white/10";
  };

  const getBallText = (ball: BallRecord) => {
    if (ball.isWicket) return "W";
    if (ball.type === BallType.WIDE) return "wd";
    if (ball.type === BallType.NO_BALL) return "nb";
    if (ball.runs === 0) return "0";
    return ball.runs.toString();
  };

  // Determine standard over placeholders
  const legalBallsCount = history.filter(b => b.type === BallType.NORMAL).length;
  const placeholders = Array(Math.max(0, 6 - legalBallsCount)).fill(null);

  return (
    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
      {history.map((ball) => (
        <div 
          key={ball.id} 
          className={`ball-circle ${getBallClass(ball)}`}
        >
          {getBallText(ball)}
        </div>
      ))}
      {placeholders.map((_, i) => (
        <div 
          key={`placeholder-${i}`} 
          className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent border border-dashed border-white/10 shrink-0"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
        </div>
      ))}
    </div>
  );
};

export default CurrentOver;