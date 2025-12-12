import React, { useState } from 'react';
import ColorBends from "../components/ui/ColorBends";
import { useIncidents } from "../context/IncidentContext";
import { Sparkles, BrainCircuit, AlertTriangle, TrendingUp, MapPin, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { subHours, isAfter } from 'date-fns';

export default function Summary() {
  const { incidents } = useIncidents();
  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState(null);

  // Fallback Simulation Logic
  const runSimulation = (recentIncidents, now) => {
    const total = recentIncidents.length;
    const typeCounts = recentIncidents.reduce((acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + 1;
        return acc;
    }, {});
    
    // Find Hotspots
    const districtCounts = recentIncidents.reduce((acc, curr) => {
        if (curr.district) acc[curr.district] = (acc[curr.district] || 0) + 1;
        return acc;
    }, {});
    const hotspot = Object.entries(districtCounts).sort((a,b) => b[1] - a[1])[0];

    const dominantType = Object.entries(typeCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'General';
    let recommendation = "Monitor local news and follow standard safety protocols.";
    if (dominantType === 'Flood') recommendation = "Mobilize rescue boats in low-lying areas and ensure drainage systems are clear.";
    if (dominantType === 'Heatwave') recommendation = "Set up cooling centers and issue public advisories to stay hydrated.";
    if (dominantType === 'Wildfire') recommendation = "Deploy fire containment units to dry zones and evacuate nearby settlements.";

    return `
**ClimateHub Analytics Report**
*Generated at ${now.toLocaleTimeString()}*
*Powered by ClimateHub Intelligence Engine*

**1. Incident Overview**
Total Incidents in last 24h: ${total}
Most Active Region: ${hotspot ? `${hotspot[0]} (${hotspot[1]} reports)` : "Distributed evenly"}

**2. Type Breakdown**
${Object.entries(typeCounts).map(([type, count]) => `• ${type}: ${count}`).join('\n') || "No significant data."}

**3. Emerging Risks**
${total > 5 ? "⚠️ High volume of reports indicates a developing crisis." : "✅ Activity levels are currently within normal range."} 
Dominant pattern: ${dominantType} events are trending.

**4. Actionable Recommendation**
${recommendation}
    `.trim();
  };

  const generateInsights = async () => {
    setLoading(true);
    setAiOutput(null);

    try {
        // 1. QUERY INCIDENTS (LAST 24 HOURS)
        const now = new Date();
        const recentIncidents = incidents.filter(i => {
            const date = new Date(i.timestamp);
            return !isNaN(date.getTime()) && isAfter(date, subHours(now, 24));
        });

        if (recentIncidents.length === 0) {
            setAiOutput("**No recent incidents to analyze.** \n\nThe system is monitoring for new reports.");
            return;
        }

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Generate Analytics Report
        const analyticsReport = runSimulation(recentIncidents, now);
        setAiOutput(analyticsReport);

    } catch (error) {
        console.error("Analytics Error:", error);
        setAiOutput(`**Analysis Unavailable**\n\nCritical Error: ${error.message}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center w-full bg-[#000000] relative overflow-y-auto">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 opacity-60">
         <ColorBends
            colors={["#059669", "#10b981", "#064e3b"]} // Darker emeralds
            rotation={30}
            speed={0.2}
            scale={1.5}
            frequency={1.0}
            warpStrength={1.5}
            mouseInfluence={0.5}
            parallax={0.6}
            noise={0.1}
            transparent={true}
         />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 justify-center h-full w-full max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="text-center space-y-6">
            <span className="text-emerald-400 text-[10px] font-bold tracking-[0.3em] uppercase bg-[#050505]/80 backdrop-blur-xl px-4 py-2 rounded-full border border-emerald-500/20 inline-block shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]">
                ClimateHub AI
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-2xl">
                Climate Intelligence <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">Reimagined</span>
            </h1>
            <p className="text-gray-400/80 text-xl font-light leading-relaxed max-w-lg mx-auto">
                Real-time analysis of environmental data patterns to predict and prevent climate disasters.
            </p>
        </div>

        {/* Action Area */}
        <div className="w-full max-w-2xl space-y-6">
            <button 
                onClick={generateInsights}
                disabled={loading}
                className={clsx(
                    "w-full py-5 rounded-2xl font-bold text-lg tracking-wide flex items-center justify-center gap-3 transition-all relative overflow-hidden group",
                    loading ? "bg-emerald-900/20 text-emerald-500 cursor-not-allowed border border-emerald-500/20" : "bg-white text-black hover:scale-[1.02] hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.6)]"
                )}
            >
                {loading ? (
                    <><Loader2 className="animate-spin" /> Analyzing Global Data...</>
                ) : (
                    <><Sparkles className="group-hover:text-emerald-600 transition-colors" /> GENERATE INSIGHTS</>
                )}
            </button>

            {/* AI Output Card */}
            {aiOutput && (
                <div className="bg-[#050505]/80 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center gap-3 mb-6 border-b border-emerald-500/20 pb-4">
                        <BrainCircuit className="text-emerald-400" size={24} />
                        <h3 className="text-emerald-50 font-mono text-sm tracking-wider uppercase">Analysis Complete</h3>
                    </div>
                    <div className="prose prose-invert prose-emerald max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed text-lg">
                            {aiOutput}
                        </pre>
                    </div>
                </div>
            )}
        </div>
      </div>
    </main>
  );
}
