
import React, { useMemo, useRef, useEffect } from 'react';
import { BallRecord, BallType } from '../types';
import { BALLS_PER_OVER } from '../constants';

interface HistoryViewProps {
  history: BallRecord[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group balls into overs
  const overs = useMemo(() => {
    const result: BallRecord[][] = [];
    let currentOver: BallRecord[] = [];
    let legalBallsCount = 0;

    history.forEach(ball => {
      currentOver.push(ball);
      if (ball.type === BallType.NORMAL) {
        legalBallsCount++;
        if (legalBallsCount === BALLS_PER_OVER) {
          result.push(currentOver);
          currentOver = [];
          legalBallsCount = 0;
        }
      }
    });

    if (currentOver.length > 0) {
      result.push(currentOver);
    }

    return result;
  }, [history]);

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const getBallNotation = (ball: BallRecord) => {
    if (ball.isWicket) return 'W';
    if (ball.type === BallType.WIDE) return `Wd${ball.runs > 0 ? `+${ball.runs}` : ''}`;
    if (ball.type === BallType.NO_BALL) return `Nb${ball.runs > 0 ? `+${ball.runs}` : ''}`;
    if (ball.runs === 0) return '•';
    return ball.runs.toString();
  };

  const getBallColor = (ball: BallRecord) => {
    if (ball.isWicket) return 'bg-red-500 text-white';
    if (ball.type !== BallType.NORMAL) return 'bg-blue-900 text-blue-200 border border-blue-700';
    if (ball.runs >= 4) return 'bg-emerald-600 text-white';
    return 'bg-slate-800 text-slate-300 border border-slate-700';
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-24 text-slate-600 italic text-sm">
        No balls recorded yet...
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="space-y-4 max-h-64 overflow-y-auto pr-2 pb-10">
      {overs.map((over, idx) => {
        const isLastOver = idx === overs.length - 1;
        const legalBallsInOver = over.filter(b => b.type === BallType.NORMAL).length;
        const isIncomplete = isLastOver && legalBallsInOver < BALLS_PER_OVER;

        return (
          <div 
            key={idx} 
            className={`flex flex-col gap-1 p-2 rounded-xl transition-all duration-300 ${
              isIncomplete ? 'bg-slate-800/40 ring-1 ring-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : ''
            }`}
          >
            <div className="flex justify-between items-center px-1">
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${isIncomplete ? 'text-emerald-400' : 'text-slate-500'}`}>
                {isLastOver && isIncomplete ? 'Current Over' : `Over ${idx + 1}`}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                {legalBallsInOver}/{BALLS_PER_OVER} Legal
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {over.map((ball) => (
                <div
                  key={ball.id}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold shadow-inner transition-transform active:scale-95 ${getBallColor(ball)} ${
                    isIncomplete ? 'ring-2 ring-emerald-500/30' : ''
                  }`}
                >
                  {getBallNotation(ball)}
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
