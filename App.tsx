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
    if (history.length === 0) return;
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
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-slate-950 relative overflow-hidden shadow-2xl ring-1 ring-white/5">
      {/* Atmosphere Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[40%] bg-indigo-600/10 blur-[120px] pointer-events-none" />

      {/* 1. Header: Fixed Scoreboard */}
      <header className="px-4 pt-6 shrink-0 z-20">
        <Scoreboard 
          runs={stats.totalRuns} 
          wickets={stats.wickets} 
          overs={stats.oversDisplay}
          onReset={handleResetRequest}
          isConfirmingReset={isConfirmingReset}
        />
      </header>

      {/* 2. Scrollable Body Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar z-10 space-y-8 scroll-smooth">
        <section>
          <div className="flex items-center gap-3 mb-5 px-1">
             <div className="h-[2px] w-8 bg-indigo-500 rounded-full"></div>
             <span className="text-[10px] font-black tracking-[0.25em] text-slate-500 uppercase">Umpire Dashboard</span>
             <div className="h-[1px] flex-1 bg-slate-900"></div>
          </div>
          <Controls onAction={addBall} onUndo={undoLastBall} canUndo={history.length > 0} />
        </section>
        
        <MatchAnalyst history={history} />

        <section className="pb-32">
          <div className="flex items-center gap-3 mb-5 px-1">
             <div className="h-[2px] w-8 bg-emerald-500 rounded-full"></div>
             <span className="text-[10px] font-black tracking-[0.25em] text-slate-500 uppercase">Match History</span>
             <div className="h-[1px] flex-1 bg-slate-900"></div>
          </div>
          <HistoryView history={history} />
        </section>
      </main>

      {/* 3. Sticky Bottom: Status Bar */}
      <footer className="shrink-0 px-6 py-4 bg-slate-950/95 backdrop-blur-xl border-t border-slate-900/50 flex justify-between items-center z-30 safe-area-bottom">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Elite Cricket Hub</span>
          <span className="text-[10px] text-slate-400 font-bold tracking-tight">V2.5 Stable Production</span>
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-emerald-500/5 rounded-full border border-emerald-500/20">
          <div className="relative">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
          </div>
          <span className="text-[9px] font-black text-emerald-500/90 uppercase tracking-widest">System Online</span>
        </div>
      </footer>
    </div>
  );
};

export default App;