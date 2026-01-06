
import React, { useState, useCallback, useEffect } from 'react';
import { generateProphecy } from './services/geminiService';
import { OracleResult, TimelineOption, SavedProphecy } from './types';
import { MysticLoader } from './components/MysticLoader';
import { ProphecyCard } from './components/ProphecyCard';
import { HistoryList } from './components/HistoryList';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [timeline, setTimeline] = useState<TimelineOption>('12 months');
  const [customTimeline, setCustomTimeline] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OracleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedProphecy[]>([]);
  const [view, setView] = useState<'input' | 'result' | 'history'>('input');

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('oracle_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('oracle_history', JSON.stringify(history));
  }, [history]);

  const saveToHistory = useCallback((topic: string, timeline: string, result: OracleResult) => {
    const newEntry: SavedProphecy = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      topic,
      timeline,
      result
    };
    setHistory(prev => [newEntry, ...prev].slice(0, 50)); // Keep last 50
  }, []);

  const handleConsult = useCallback(async () => {
    if (!topic.trim()) {
      setError("Pray, tell the Oracle what you seek knowledge of.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setView('result');

    const actualTimeline = timeline === 'custom' ? customTimeline : timeline;

    try {
      const data = await generateProphecy(topic, actualTimeline);
      setResult(data);
      saveToHistory(topic, actualTimeline, data);
    } catch (err: any) {
      setError(err.message || "The cosmic link was interrupted.");
      setView('input');
    } finally {
      setLoading(false);
    }
  }, [topic, timeline, customTimeline, saveToHistory]);

  const selectHistoryItem = (item: SavedProphecy) => {
    setResult(item.result);
    setTopic(item.topic);
    setView('result');
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen oracle-gradient px-4 py-12 relative">
      <div className="star-field"></div>
      
      {/* Header */}
      <header className="max-w-4xl mx-auto text-center mb-16 relative">
        <div className="absolute right-0 top-0">
          <button 
            onClick={() => setView(view === 'history' ? 'input' : 'history')}
            className="flex flex-col items-center group"
            title="View Archives"
          >
            <div className="w-12 h-12 rounded-full border border-yellow-500/30 flex items-center justify-center text-yellow-500/60 group-hover:text-yellow-400 group-hover:border-yellow-500/60 transition-all bg-slate-900/40 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-[10px] font-mystic mt-1 text-yellow-600 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">Archives</span>
          </button>
        </div>

        <div className="inline-block p-4 mb-4">
          <div className="w-24 h-24 mx-auto bg-gradient-to-b from-yellow-400 to-yellow-700 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.4)] animate-float">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          </div>
        </div>
        <h1 className="font-mystic text-5xl md:text-7xl text-yellow-500 tracking-tighter mb-4 cursor-pointer" onClick={() => setView('input')}>
          The Aether Oracle
        </h1>
        <p className="font-scroll text-xl text-slate-400 italic">
          "Peering through the veil of time, fueled by historical echoes and current tides."
        </p>
      </header>

      {/* Navigation Content */}
      <main>
        {view === 'history' && !loading && (
          <HistoryList 
            history={history} 
            onSelect={selectHistoryItem} 
            onDelete={deleteHistoryItem}
            onClose={() => setView('input')}
          />
        )}

        {view === 'input' && !loading && (
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

        {loading && <MysticLoader />}

        {view === 'result' && result && !loading && (
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => setView('input')}
                className="font-mystic text-sm text-slate-400 hover:text-yellow-500 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                New Inquiry
              </button>
              <div className="text-slate-500 font-mystic text-xs uppercase tracking-widest">
                Viewing Record: {topic}
              </div>
            </div>
            <ProphecyCard result={result} />
          </div>
        )}
      </main>

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
