import LightRays from '../components/ui/LightRays';
import IncidentForm from '../components/Forms/IncidentForm';

export default function Report() {
  return (
    <div className="bg-[#000000] min-h-screen relative overflow-y-auto">
      {/* Lively Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <LightRays
            raysOrigin="top-center"
            raysColor="#10b981" // Emerald
            raysSpeed={1.0}
            lightSpread={1.0}
            rayLength={1.5}
            className="opacity-30"
          />
      </div>
      
      <div className="max-w-3xl mx-auto p-4 md:p-8 relative z-10">
         <IncidentForm />
      </div>
    </div>
  );
}
