
import React, { useState, useEffect, useMemo } from 'react';
import { BallRecord, BallType, InningsState } from './types';
import { STORAGE_KEY, BALLS_PER_OVER } from './constants';
import Scoreboard from './components/Scoreboard';
import Controls from './components/Controls';
import HistoryView from './components/HistoryView';

const App: React.FC = () => {
  const [history, setHistory] = useState<BallRecord[]>([]);

  // Load state on mount
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

  // Persist state on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ history }));
  }, [history]);

  const addBall = (runs: number, type: BallType, isWicket: boolean) => {
    const newBall: BallRecord = {
      id: Math.random().toString(36).substr(2, 9),
      runs,
      type,
      isWicket,
      timestamp: Date.now()
    };
    setHistory(prev => [...prev, newBall]);
  };

  const undoLastBall = () => {
    setHistory(prev => prev.slice(0, -1));
  };

  const resetInnings = () => {
    if (window.confirm("Reset entire innings? This cannot be undone.")) {
      setHistory([]);
    }
  };

  // Derived Statistics
  const stats = useMemo(() => {
    let totalRuns = 0;
    let wickets = 0;
    let legalBalls = 0;

    history.forEach(ball => {
      // Logic: Wide/No-Ball = 1 extra run + any runs scored
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
    <div className="flex flex-col h-screen max-w-md mx-auto overflow-hidden">
      {/* Header / Scoreboard */}
      <div className="bg-slate-800 p-6 shadow-xl border-b border-slate-700">
        <Scoreboard 
          runs={stats.totalRuns} 
          wickets={stats.wickets} 
          overs={stats.oversDisplay}
          onReset={resetInnings}
        />
      </div>

      {/* Main Interaction Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        <Controls onAction={addBall} onUndo={undoLastBall} canUndo={history.length > 0} />
        
        <div className="mt-4 border-t border-slate-700 pt-4 flex-1">
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Innings History</h3>
          <HistoryView history={history} />
        </div>
      </div>

      <footer className="p-2 text-center text-[10px] text-slate-500 bg-slate-900 border-t border-slate-800">
        BoxCricket Umpire Tools • Weekend Casual Match
      </footer>
    </div>
  );
};

export default App;
