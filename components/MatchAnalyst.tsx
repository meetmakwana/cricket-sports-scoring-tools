
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BallRecord } from '../types';

interface MatchAnalystProps {
  history: BallRecord[];
}

const MatchAnalyst: React.FC<MatchAnalystProps> = ({ history }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    if (history.length < 3) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const historyStr = history.map(b => 
        `${b.type === 'NORMAL' ? b.runs : b.type}${b.isWicket ? '(W)' : ''}`
      ).join(', ');

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this Box Cricket innings history (WD=Wide, NB=NoBall, W=Wicket): [${historyStr}]. 
                   Provide a single, very concise tactical sentence (max 15 words) for the captain. 
                   Focus on momentum or pressure.`,
      });

      setInsight(response.text || "Keep the pressure on!");
    } catch (error) {
      console.error("AI Insight failed", error);
      setInsight("Bowling tight lines will restrict the run flow.");
    } finally {
      setLoading(false);
    }
  };

  if (history.length < 6) return null;

  return (
    <div className="mt-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 overflow-hidden relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Match Analyst</h4>
        </div>
        <button 
          onClick={generateInsight}
          disabled={loading}
          className="text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-3 py-1 rounded-full transition-all"
        >
          {loading ? 'ANALYZING...' : 'GET INSIGHT'}
        </button>
      </div>
      
      {insight && !loading && (
        <p className="text-sm text-slate-300 font-medium animate-in fade-in slide-in-from-bottom-2 duration-500">
          "{insight}"
        </p>
      )}
      
      {loading && (
        <div className="h-4 bg-slate-700/50 rounded animate-pulse w-3/4" />
      )}
      
      {!insight && !loading && (
        <p className="text-[11px] text-slate-500 italic">
          Click above for tactical AI insights based on current momentum.
        </p>
      )}
    </div>
  );
};

export default MatchAnalyst;
