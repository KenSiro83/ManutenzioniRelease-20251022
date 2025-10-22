import React from 'react';

interface SetupErrorProps {
  message: string;
}

const SetupError: React.FC<SetupErrorProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <div className="p-8 bg-white rounded-lg shadow-2xl max-w-lg text-center border-t-4 border-red-500">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Configurazione Richiesta</h1>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="bg-gray-50 p-4 rounded-md text-left text-sm text-gray-800">
          <p className="font-semibold">Azione richiesta:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Apri il file <code className="bg-gray-200 text-red-700 px-1.5 py-0.5 rounded-md font-mono">index.html</code>.</li>
            <li>Trova la sezione dello script con i commenti.</li>
            <li>Sostituisci i valori segnaposto con le tue chiavi Supabase reali.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SetupError;
