import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BallRecord, BallType, InningsState } from './types';
import { STORAGE_KEY, BALLS_PER_OVER } from './constants';
import Scoreboard from './components/Scoreboard';
import Controls from './components/Controls';
import HistoryView from './components/HistoryView';
import MatchAnalyst from './components/MatchAnalyst';
import { Haptics } from './services/vibration';

const App: React.FC = () => {
  const [history, setHistory] = useState<BallRecord[]>([]);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as InningsState;
        setHistory(parsed.history);
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
    return () => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ history }));
  }, [history]);

  const addBall = (runs: number, type: BallType, isWicket: boolean) => {
    if (isConfirmingReset) {
      setIsConfirmingReset(false);
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    }

    const newBall: BallRecord = {
      id: Math.random().toString(36).substring(2, 11),
      runs,
      type,
      isWicket,
      timestamp: Date.now()
    };
    
    if (isWicket) Haptics.heavy();
    else if (type !== BallType.NORMAL) Haptics.medium();
    else Haptics.light();

    setHistory(prev => [...prev, newBall]);
  };

  const undoLastBall = () => {
    Haptics.medium();
    setHistory(prev => prev.slice(0, -1));
  };

  const handleResetRequest = () => {
    if (!isConfirmingReset) {
      Haptics.light();
      setIsConfirmingReset(true);
      resetTimerRef.current = window.setTimeout(() => {
        setIsConfirmingReset(false);
      }, 3000);
    } else {
      Haptics.error();
      setHistory([]);
      setIsConfirmingReset(false);
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    }
  };

  const stats = useMemo(() => {
    let totalRuns = 0;
    let wickets = 0;
    let legalBalls = 0;

    history.forEach(ball => {
      if (ball.type !== BallType.NORMAL) {
        totalRuns += (ball.runs + 1);
      } else {
        totalRuns += ball.runs;
        legalBalls += 1;
      }
      if (ball.isWicket) wickets += 1;
    });

    const completedOvers = Math.floor(legalBalls / BALLS_PER_OVER);
    const currentOverBalls = legalBalls % BALLS_PER_OVER;

    return {
      totalRuns,
      wickets,
      oversDisplay: `${completedOvers}.${currentOverBalls}`,
      legalBalls
    };
  }, [history]);

  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-slate-950 border-x border-slate-900 shadow-2xl relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-indigo-500/10 blur-[120px] pointer-events-none -z-10"></div>
      
      {/* 1. Sticky Header Section */}
      <header className="p-4 pt-6 shrink-0">
        <Scoreboard 
          runs={stats.totalRuns} 
          wickets={stats.wickets} 
          overs={stats.oversDisplay}
          onReset={handleResetRequest}
          isConfirmingReset={isConfirmingReset}
        />
      </header>

      {/* 2. Scrollable Body Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-20 no-scrollbar space-y-6">
        <section className="mt-2">
          <div className="flex items-center gap-4 mb-4">
             <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase whitespace-nowrap">Input Controls</span>
             <div className="h-[1px] w-full bg-slate-900"></div>
          </div>
          <Controls onAction={addBall} onUndo={undoLastBall} canUndo={history.length > 0} />
        </section>
        
        <MatchAnalyst history={history} />

        <section>
          <div className="flex items-center gap-4 mb-4">
             <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase whitespace-nowrap">Innings Timeline</span>
             <div className="h-[1px] w-full bg-slate-900"></div>
          </div>
          <HistoryView history={history} />
        </section>
      </main>

      {/* 3. Sticky Footer Information */}
      <footer className="shrink-0 p-4 bg-slate-950/80 backdrop-blur-xl border-t border-slate-900 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">BoxCricket Elite</span>
          <span className="text-[10px] text-slate-400 font-medium">Digital Umpire v2.4</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Live Session</span>
        </div>
      </footer>
    </div>
  );
};

export default App;