
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
    return () => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  // Persist state on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ history }));
  }, [history]);

  const addBall = (runs: number, type: BallType, isWicket: boolean) => {
    // Cancel any pending reset if a ball is added
    if (isConfirmingReset) {
      setIsConfirmingReset(false);
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    }

    const newBall: BallRecord = {
      id: Math.random().toString(36).substr(2, 9),
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
      // First tap: Enter confirm state
      Haptics.light();
      setIsConfirmingReset(true);
      resetTimerRef.current = window.setTimeout(() => {
        setIsConfirmingReset(false);
      }, 3000); // Revert after 3 seconds
    } else {
      // Second tap: Execute reset
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
    <div className="flex flex-col h-screen max-w-md mx-auto overflow-hidden bg-slate-950">
      <div className="bg-slate-900/80 backdrop-blur-md p-6 shadow-2xl border-b border-slate-800 sticky top-0 z-10">
        <Scoreboard 
          runs={stats.totalRuns} 
          wickets={stats.wickets} 
          overs={stats.oversDisplay}
          onReset={handleResetRequest}
          isConfirmingReset={isConfirmingReset}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <Controls onAction={addBall} onUndo={undoLastBall} canUndo={history.length > 0} />
        
        <MatchAnalyst history={history} />

        <div className="mt-8 border-t border-slate-800/50 pt-6 pb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Innings Timeline</h3>
            <div className="h-[1px] flex-1 bg-slate-800 mx-4"></div>
          </div>
          <HistoryView history={history} />
        </div>
      </div>

      <footer className="p-3 text-center text-[10px] text-slate-600 bg-slate-900/50 border-t border-slate-800 backdrop-blur-sm">
        BOX CRICKET UMPIRE PRO <span className="mx-2 opacity-30">•</span> EST 2024
      </footer>
    </div>
  );
};

export default App;
