import React, { useState, useEffect, useMemo } from 'react';
import { BallRecord, BallType, InningsState } from './types';
import { STORAGE_KEY, BALLS_PER_OVER } from './constants';
import Scoreboard from './components/Scoreboard';
import Controls from './components/Controls';
import CurrentOver from './components/CurrentOver';
import HistoryView from './components/HistoryView';
import { Haptics } from './services/vibration';

const App: React.FC = () => {
  const [history, setHistory] = useState<BallRecord[]>([]);
  
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
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ history }));
  }, [history]);

  const addBall = (runs: number, type: BallType, isWicket: boolean) => {
    const newBall: BallRecord = {
      id: Math.random().toString(36).substring(2, 11),
      runs,
      type,
      isWicket,
      timestamp: Date.now()
    };
    
    if (isWicket) Haptics.heavy();
    else if (runs >= 4) Haptics.medium();
    else Haptics.light();

    setHistory(prev => [...prev, newBall]);
  };

  const undoLastBall = () => {
    if (history.length === 0) return;
    Haptics.medium();
    setHistory(prev => prev.slice(0, -1));
  };

  const resetMatch = () => {
    if (window.confirm("Are you sure you want to reset this innings?")) {
      Haptics.error();
      setHistory([]);
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
    const oversDisplay = `${completedOvers}.${currentOverBalls}`;
    
    const oversAsNum = completedOvers + (currentOverBalls / 6);
    const crr = oversAsNum > 0 ? (totalRuns / oversAsNum).toFixed(1) : "0.0";

    // Current over logic
    const currentOverHistory: BallRecord[] = [];
    let count = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      currentOverHistory.unshift(history[i]);
      if (history[i].type === BallType.NORMAL) count++;
      if (count === (currentOverBalls || BALLS_PER_OVER) && history[i].type === BallType.NORMAL) break;
    }

    const currentOverRuns = currentOverHistory.reduce((sum, b) => 
      sum + b.runs + (b.type !== BallType.NORMAL ? 1 : 0), 0);

    return {
      totalRuns,
      wickets,
      oversDisplay,
      crr,
      currentOverHistory,
      currentOverRuns
    };
  }, [history]);

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-[#0B120E] text-white overflow-hidden select-none">
      {/* 1. Header */}
      <header className="flex items-center justify-between px-6 pt-10 pb-4 shrink-0">
        <button className="p-2 -ml-2 text-white/80 active:scale-90 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-xl font-black tracking-tight text-white/90">Innings 1</h1>
        <button className="text-sm font-black text-[#10B981] px-4 py-2 rounded-full uppercase tracking-wider active:bg-white/5">
          End Innings
        </button>
      </header>

      <main className="flex-1 flex flex-col px-6 overflow-y-auto no-scrollbar">
        {/* 2. Scoreboard Section */}
        <section className="flex flex-col items-center py-4 shrink-0">
          <Scoreboard 
            runs={stats.totalRuns} 
            wickets={stats.wickets} 
            overs={stats.oversDisplay} 
            crr={stats.crr}
          />
        </section>

        {/* 3. This Over Strip */}
        <section className="mb-8 shrink-0">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">This Over</span>
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{stats.currentOverRuns} Runs</span>
          </div>
          <CurrentOver history={stats.currentOverHistory} />
        </section>

        {/* 4. Controls Section */}
        <section className="shrink-0 mb-6">
          <div className="bg-[#16211B]/50 rounded-[2.5rem] p-5 space-y-6">
            <Controls onAction={addBall} />
            
            <button 
              onClick={undoLastBall}
              className="btn-press w-full py-5 rounded-[1.5rem] border-2 border-dashed border-white/10 flex items-center justify-center gap-3 text-white/50 font-black text-sm uppercase tracking-widest hover:border-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
              Undo Last Ball
            </button>
          </div>
        </section>

        {/* 5. Reset Innings */}
        <div className="flex justify-center mb-10">
          <button 
            onClick={resetMatch}
            className="flex items-center gap-2 text-[#EF4444] font-black text-[11px] uppercase tracking-widest py-2 px-4 active:scale-95 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Reset Innings
          </button>
        </div>

        {/* 6. Completed Overs History */}
        <section className="pb-20">
          <div className="flex items-center justify-between mb-4 px-1">
             <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Completed Overs</span>
             <span className="text-[9px] font-black bg-white/5 text-white/30 px-3 py-1 rounded-full uppercase">{Math.floor(stats.totalRuns/stats.totalRuns || 0)} Overs</span>
          </div>
          <HistoryView history={history} />
        </section>
      </main>
    </div>
  );
};

export default App;