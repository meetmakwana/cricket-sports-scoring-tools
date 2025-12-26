import React, { useMemo } from 'react';
import { BallRecord, BallType } from '../types';
import { BALLS_PER_OVER } from '../constants';

interface HistoryViewProps {
  history: BallRecord[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const completedOvers = useMemo(() => {
    const overs: { balls: BallRecord[], runs: number }[] = [];
    let currentOverBalls: BallRecord[] = [];
    let currentOverRuns = 0;
    let legalBalls = 0;

    history.forEach(ball => {
      currentOverBalls.push(ball);
      currentOverRuns += ball.runs + (ball.type !== BallType.NORMAL ? 1 : 0);
      
      if (ball.type === BallType.NORMAL) {
        legalBalls++;
        if (legalBalls === BALLS_PER_OVER) {
          overs.unshift({ balls: [...currentOverBalls], runs: currentOverRuns });
          currentOverBalls = [];
          currentOverRuns = 0;
          legalBalls = 0;
        }
      }
    });

    return overs;
  }, [history]);

  const getBallClass = (ball: BallRecord) => {
    if (ball.isWicket) return "bg-rose-500 text-white";
    if (ball.runs === 4 || ball.runs === 6) return "bg-[#10B981] text-black";
    if (ball.type !== BallType.NORMAL) return "bg-orange-700/30 text-orange-400 border border-orange-500/20";
    return "bg-white/10 text-white/60";
  };

  const getBallText = (ball: BallRecord) => {
    if (ball.isWicket) return "w";
    if (ball.type === BallType.WIDE) return "wd";
    if (ball.type === BallType.NO_BALL) return "nb";
    return ball.runs.toString();
  };

  if (completedOvers.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">
        No completed overs yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {completedOvers.map((over, idx) => (
        <div 
          key={`over-${completedOvers.length - idx}`} 
          className="bg-[#16211B]/40 rounded-2xl p-4 flex items-center justify-between border border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="px-2 py-1 rounded bg-white/5 text-[9px] font-black text-white/40 uppercase">
              OV {completedOvers.length - idx}
            </div>
            <div className="flex items-center gap-1.5">
              {over.balls.map(ball => (
                <div 
                  key={ball.id} 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${getBallClass(ball)}`}
                >
                  {getBallText(ball)}
                </div>
              ))}
            </div>
          </div>
          <div className="text-[11px] font-black text-white/80 uppercase">
            {over.runs} {over.runs === 1 ? 'Run' : 'Runs'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryView;