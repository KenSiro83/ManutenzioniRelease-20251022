import React from 'react';
import { IconArrowLeft } from '../components/icons.tsx';

const MaintenanceDetail: React.FC<{ id: string }> = ({ id }) => {
  return (
    <div>
      <div className="mb-6">
          <button onClick={() => window.location.hash = '#/maintenance'} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
              <IconArrowLeft className="h-4 w-4 mr-2" />
              Torna alle manutenzioni
          </button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold">Dettaglio Manutenzione #{id}</h1>
        <p className="mt-4">Dettagli per la richiesta di manutenzione con ID: {id}.</p>
      </div>
    </div>
  );
};

export default MaintenanceDetail;