import React from 'react';
import { IconPlusCircle } from '../components/icons.tsx';

const Inventory: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Magazzino Ricambi</h1>
        <button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
          <IconPlusCircle className="h-5 w-5 mr-2" />
          Aggiungi Ricambio
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p>Elenco dei ricambi in magazzino.</p>
      </div>
    </div>
  );
};

export default Inventory;