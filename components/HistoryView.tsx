import React, { useMemo, useRef, useEffect } from 'react';
import { BallRecord, BallType } from '../types';
import { BALLS_PER_OVER } from '../constants';

interface HistoryViewProps {
  history: BallRecord[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

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

    if (currentOver.length > 0) {
      result.push(currentOver);
    }

    return result;
  }, [history]);

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
    if (ball.isWicket) return 'bg-rose-500 text-white shadow-[0_2px_8px_rgba(225,29,72,0.3)] ring-1 ring-rose-400';
    if (ball.type !== BallType.NORMAL) return 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/50';
    if (ball.runs === 6) return 'bg-yellow-500 text-slate-950 font-black shadow-[0_2px_8px_rgba(234,179,8,0.3)]';
    if (ball.runs === 4) return 'bg-slate-300 text-slate-950 font-black shadow-[0_2px_8px_rgba(255,255,255,0.2)]';
    if (ball.runs === 0) return 'bg-slate-900 text-slate-600 border border-slate-800';
    return 'bg-slate-800 text-slate-100 border border-slate-700';
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-600 border-2 border-dashed border-slate-900 rounded-[2rem]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-40">Waiting for first ball</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-8">
      {overs.map((over, idx) => {
        const isLastOver = idx === overs.length - 1;
        const legalBallsInOver = over.filter(b => b.type === BallType.NORMAL).length;
        const isIncomplete = isLastOver && legalBallsInOver < BALLS_PER_OVER;

        return (
          <div 
            key={idx} 
            className={`p-3 rounded-[1.5rem] border transition-all duration-300 ${
              isIncomplete 
                ? 'bg-slate-900/30 border-white/5 shadow-inner' 
                : 'bg-slate-950 border-slate-900'
            }`}
          >
            <div className="flex justify-between items-center mb-2.5 px-1">
              <span className={`text-[9px] font-black uppercase tracking-widest ${isIncomplete ? 'text-emerald-500' : 'text-slate-600'}`}>
                {isLastOver && isIncomplete ? 'Current Over' : `Over ${idx + 1}`}
              </span>
              <div className="h-px flex-1 bg-slate-900 mx-3"></div>
              <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">
                {legalBallsInOver}/{BALLS_PER_OVER} Legal
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {over.map((ball) => (
                <div
                  key={ball.id}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-black transition-transform active:scale-95 ${getBallColor(ball)}`}
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