import ColorBends from "../components/ui/ColorBends";

export default function Summary() {
  return (
    <main className="min-h-screen flex items-center justify-center w-full bg-slate-950 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
         <ColorBends
            colors={["#059669", "#10b981", "#34d399"]}
            rotation={30}
            speed={0.3}
            scale={1.2}
            frequency={1.4}
            warpStrength={1.2}
            mouseInfluence={0.8}
            parallax={0.6}
            noise={0.08}
            transparent={false}
         />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 justify-center h-full">
        {/* Optional subtle label */}
        <div className="text-center space-y-4 max-w-2xl px-4">
            <p className="text-emerald-400 text-xs font-medium tracking-[0.2em] uppercase bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/20 inline-block">ClimateHub AI</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                Climate Intelligence <br/> 
                <span className="text-emerald-400">Reimagined</span>
            </h1>
            <p className="text-slate-200 text-lg drop-shadow-md">
                Real-time analysis of environmental data patterns to predict and prevent climate disasters.
            </p>
        </div>
      </div>
    </main>
  );
}
