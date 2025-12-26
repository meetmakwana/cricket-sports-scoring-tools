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

      setInsight(response.text?.trim() || "Keep the pressure on!");
    } catch (error) {
      console.error("AI Insight failed", error);
      setInsight("Bowling tight lines will restrict the run flow.");
    } finally {
      setLoading(false);
    }
  };

  if (history.length < 6) return null;

  return (
    <div className="glass-panel rounded-[1.5rem] p-5 overflow-hidden relative group transition-all duration-500 hover:border-indigo-500/30">
      {/* Pulse line decoration */}
      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50 group-hover:h-full transition-all"></div>
      
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Tactical AI</h4>
        </div>
        <button 
          onClick={generateInsight}
          disabled={loading}
          className="btn-press text-[9px] font-black bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 disabled:opacity-50 px-4 py-1.5 rounded-full transition-all text-indigo-300 uppercase tracking-widest"
        >
          {loading ? 'Consulting...' : 'Get Insight'}
        </button>
      </div>
      
      <div className="min-h-[2.5rem] flex items-center relative z-10">
        {insight && !loading ? (
          <p className="text-sm text-slate-200 font-medium italic leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500">
            "{insight}"
          </p>
        ) : loading ? (
          <div className="w-full space-y-2">
            <div className="h-2 bg-slate-800 rounded animate-pulse w-full" />
            <div className="h-2 bg-slate-800 rounded animate-pulse w-2/3" />
          </div>
        ) : (
          <p className="text-[11px] text-slate-500 italic font-medium">
            Tap the insight button to analyze the current match momentum.
          </p>
        )}
      </div>
    </div>
  );
};

export default MatchAnalyst;