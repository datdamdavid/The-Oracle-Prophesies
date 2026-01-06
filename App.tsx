
import React, { useState, useCallback } from 'react';
import { generateProphecy } from './services/geminiService';
import { OracleResult, TimelineOption } from './types';
import { MysticLoader } from './components/MysticLoader';
import { ProphecyCard } from './components/ProphecyCard';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [timeline, setTimeline] = useState<TimelineOption>('12 months');
  const [customTimeline, setCustomTimeline] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OracleResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConsult = useCallback(async () => {
    if (!topic.trim()) {
      setError("Pray, tell the Oracle what you seek knowledge of.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const actualTimeline = timeline === 'custom' ? customTimeline : timeline;

    try {
      const data = await generateProphecy(topic, actualTimeline);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "The cosmic link was interrupted.");
    } finally {
      setLoading(false);
    }
  }, [topic, timeline, customTimeline]);

  return (
    <div className="min-h-screen oracle-gradient px-4 py-12 relative">
      <div className="star-field"></div>
      
      {/* Header */}
      <header className="max-w-4xl mx-auto text-center mb-16 relative">
        <div className="inline-block p-4 mb-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-b from-yellow-400 to-yellow-700 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.4)] animate-float">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          </div>
        </div>
        <h1 className="font-mystic text-5xl md:text-7xl text-yellow-500 tracking-tighter mb-4">
          The Aether Oracle
        </h1>
        <p className="font-scroll text-xl text-slate-400 italic">
          "Peering through the veil of time, fueled by historical echoes and current tides."
        </p>
      </header>

      {/* Input Section */}
      {!result && !loading && (
        <section className="max-w-2xl mx-auto mystic-border bg-slate-900/60 backdrop-blur-lg p-8 rounded-3xl animate-in zoom-in duration-700">
          <div className="space-y-6">
            <div>
              <label className="block font-mystic text-sm text-yellow-600 uppercase tracking-widest mb-2">Subject of Inquiry</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Artificial Intelligence, Global Economy, Space Exploration..."
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all text-slate-200 placeholder-slate-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-mystic text-sm text-yellow-600 uppercase tracking-widest mb-2">Temporal Scope</label>
                <select 
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value as TimelineOption)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all text-slate-200"
                >
                  <option value="6 months">Next 6 Months</option>
                  <option value="12 months">Next Year</option>
                  <option value="24 months">Next 2 Years</option>
                  <option value="5 years">Next 5 Years</option>
                  <option value="custom">Custom Timeline...</option>
                </select>
              </div>

              {timeline === 'custom' && (
                <div className="animate-in slide-in-from-top-4">
                  <label className="block font-mystic text-sm text-yellow-600 uppercase tracking-widest mb-2">Specify Time</label>
                  <input 
                    type="text" 
                    value={customTimeline}
                    onChange={(e) => setCustomTimeline(e.target.value)}
                    placeholder="e.g. 10 years, 3 decades"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all text-slate-200"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 text-sm animate-bounce">
                {error}
              </div>
            )}

            <button 
              onClick={handleConsult}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-slate-950 font-mystic font-bold py-4 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:shadow-[0_0_50px_rgba(234,179,8,0.5)] transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest"
            >
              Invoke the Prophecy
            </button>
          </div>
        </section>
      )}

      {/* Loading State */}
      {loading && <MysticLoader />}

      {/* Result Section */}
      {result && (
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => { setResult(null); setTopic(''); }}
              className="font-mystic text-sm text-slate-400 hover:text-yellow-500 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              New Inquiry
            </button>
          </div>
          <ProphecyCard result={result} />
        </div>
      )}

      {/* Footer Disclaimer */}
      <footer className="max-w-4xl mx-auto mt-24 text-center border-t border-slate-800 pt-8 pb-12">
        <p className="text-slate-500 text-xs font-scroll max-w-lg mx-auto leading-relaxed">
          The Aether Oracle is an experimental intelligence that analyzes vast amounts of historical data and current event patterns to generate speculative narratives. No prediction should be taken as fact or advice. This tool is for artistic and entertainment expression only.
        </p>
      </footer>
    </div>
  );
};

export default App;
