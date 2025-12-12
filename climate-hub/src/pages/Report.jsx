import React from 'react';
import IncidentForm from '../components/Forms/IncidentForm';

export default function Report() {
  return (
    <div className="bg-slate-950 min-h-full">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
         <IncidentForm />
      </div>
    </div>
  );
}
