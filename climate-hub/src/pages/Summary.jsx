import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { incidentStore } from '../services/incidentStore';
import { aiService } from '../services/aiService';
import { subHours, isAfter } from 'date-fns';
import clsx from 'clsx';

export default function Summary() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [incidentsCount, setIncidentsCount] = useState(0);

  const fetchAndGenerate = async () => {
    setLoading(true);
    try {
        const allIncidents = incidentStore.getAll();
        // Filter last 24 hours
        const recent = allIncidents.filter(i => 
            isAfter(new Date(i.timestamp), subHours(new Date(), 24))
        );
        setIncidentsCount(recent.length);
        
        const result = await aiService.generateSummary(recent);
        setSummary(result);
    } catch (err) {
        setSummary("Failed to generate summary. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndGenerate();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition">
        <ArrowLeft size={18} className="mr-1" /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
                <Sparkles className="text-yellow-300" size={24} />
                <h2 className="text-2xl font-bold">AI Climate Insights</h2>
            </div>
            <p className="opacity-90">Analyzing {incidentsCount} incidents from the last 24 hours.</p>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[300px]">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400">
                    <RefreshCw className="animate-spin mb-4" size={40} />
                    <p>Analyzing logic patterns...</p>
                </div>
            ) : (
                <div className="prose prose-slate max-w-none">
                     {summary ? (
                         <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                             {/* Simple markdown bold parsing for **text** */}
                             {summary.split('\n').map((line, i) => {
                                 // Basic bold parser
                                 const parts = line.split(/(\*\*.*?\*\*)/g);
                                 return (
                                    <div key={i} className={clsx("mb-2", line.startsWith('-') && "ml-4")}>
                                        {parts.map((part, j) => {
                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                return <strong key={j} className="text-slate-900">{part.slice(2, -2)}</strong>;
                                            } else if (part.startsWith('###')) {
                                                return <h3 key={j} className="text-xl font-bold text-slate-800 mt-4 mb-2">{part.replace('###', '').trim()}</h3>;
                                            }
                                            return part;
                                        })}
                                    </div>
                                 );
                             })}
                         </div>
                     ) : (
                         <p>No summary available.</p>
                     )}
                </div>
            )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button 
                onClick={fetchAndGenerate}
                disabled={loading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50"
            >
                <RefreshCw size={16} className={clsx(loading && "animate-spin")} />
                Regenerate Analysis
            </button>
        </div>
      </div>
    </div>
  );
}
