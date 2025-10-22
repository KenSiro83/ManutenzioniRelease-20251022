import React from 'react';

const Planimetrie: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Planimetrie</h1>
      <div className="bg-white p-4 rounded-lg shadow-md mt-6">
        <p>Visualizzazione delle planimetrie del sito.</p>
        <div className="mt-4 h-96 bg-gray-200 rounded flex items-center justify-center">
            <p className="text-gray-500">Mappa non disponibile</p>
        </div>
      </div>
    </div>
  );
};

export default Planimetrie;
