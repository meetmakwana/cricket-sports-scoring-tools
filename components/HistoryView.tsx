import React, { useMemo, useRef, useEffect } from 'react';
import { BallRecord, BallType } from '../types';
import { BALLS_PER_OVER } from '../constants';

interface HistoryViewProps {
  history: BallRecord[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const overs = useMemo(() => {
    const result: BallRecord[][] = [];
    let currentOver: BallRecord[] = [];
    let legalBallsCount = 0;

    history.forEach(ball => {
      currentOver.push(ball);
      if (ball.type === BallType.NORMAL) {
        legalBallsCount++;
        if (legalBallsCount === BALLS_PER_OVER) {
          result.push([...currentOver]);
          currentOver = [];
          legalBallsCount = 0;
        }
      }
    });

    if (currentOver.length > 0) result.push(currentOver);
    return result;
  }, [history]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const getBallDisplay = (ball: BallRecord) => {
    if (ball.isWicket) return 'W';
    if (ball.type === BallType.WIDE) return 'Wd';
    if (ball.type === BallType.NO_BALL) return 'Nb';
    return ball.runs === 0 ? '•' : ball.runs.toString();
  };

  const getBallClass = (ball: BallRecord) => {
    const base = "w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black shadow-md transition-all active:scale-90 ";
    if (ball.isWicket) return base + "bg-rose-600 text-white ring-2 ring-rose-400 shadow-rose-900/40";
    if (ball.type !== BallType.NORMAL) return base + "bg-indigo-900/40 text-indigo-300 border border-indigo-700/50";
    if (ball.runs === 6) return base + "bg-yellow-500 text-slate-950 scale-105 shadow-yellow-900/40";
    if (ball.runs === 4) return base + "bg-slate-200 text-slate-950";
    return base + "bg-slate-900 text-slate-500 border border-slate-800";
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-700 border-2 border-dashed border-slate-900 rounded-[2.5rem] bg-slate-900/10">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">First Ball Pending</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-4">
      {overs.map((over, idx) => {
        const isCurrent = idx === overs.length - 1;
        const legalInOver = over.filter(b => b.type === BallType.NORMAL).length;

        return (
          <div 
            key={idx} 
            className={`p-4 rounded-[2rem] border transition-all duration-300 ${
              isCurrent 
                ? 'bg-slate-900/30 border-indigo-500/20 shadow-xl' 
                : 'bg-slate-950 border-slate-900 shadow-sm'
            }`}
          >
            <div className="flex flex-row justify-between items-center mb-4">
              <span className={`text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'text-indigo-400' : 'text-slate-600'}`}>
                {isCurrent && legalInOver < BALLS_PER_OVER ? 'Active Over' : `Completed Over ${idx + 1}`}
              </span>
              <div className="h-px flex-1 bg-slate-900 mx-4"></div>
              <span className="text-[10px] font-bold text-slate-700 uppercase">
                {legalInOver}/{BALLS_PER_OVER} Legal
              </span>
            </div>
            
            <div className="flex flex-row flex-wrap gap-3">
              {over.map((ball) => (
                <div key={ball.id} className={getBallClass(ball)}>
                  {getBallDisplay(ball)}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryView;