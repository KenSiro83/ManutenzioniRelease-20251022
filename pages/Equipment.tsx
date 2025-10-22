import React, { useState, FormEvent, useEffect, useMemo } from 'react';
import { EQUIPMENT_CATEGORIES } from '../constants.ts';
import { Equipment, EquipmentStatus, Site } from '../types.ts';
import { IconFilter, IconPlusCircle } from '../components/icons.tsx';
import { useData } from '../contexts/DataContext.tsx';
import { supabase } from '../supabaseClient.ts';

const getStatusColor = (status: EquipmentStatus) => {
    switch (status) {
        case EquipmentStatus.Operativo: return 'bg-green-100 text-green-800';
        case EquipmentStatus.InManutenzione: return 'bg-yellow-100 text-yellow-800';
        case EquipmentStatus.Guasto: return 'bg-red-100 text-red-800';
        case EquipmentStatus.FuoriServizio: return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const NewEquipmentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (equipment: Omit<Equipment, 'id' | 'last_maintenance' | 'floor_plan_id' | 'position'>) => void;
    sites: Site[];
}> = ({ isOpen, onClose, onSubmit, sites }) => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [siteId, setSiteId] = useState<number>(sites.length > 0 ? sites[0].id : 0);
    const [category, setCategory] = useState<string>(EQUIPMENT_CATEGORIES.length > 0 ? EQUIPMENT_CATEGORIES[0] : '');
    const [status, setStatus] = useState<EquipmentStatus>(EquipmentStatus.Operativo);

    useEffect(() => {
        if (isOpen && sites.length > 0 && !siteId) {
            setSiteId(sites[0].id);
        }
    }, [isOpen, sites, siteId]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!name || !location || !siteId || !category) {
            alert('Per favore, compila tutti i campi.');
            return;
        }
        onSubmit({ name, location, site_id: Number(siteId), category, status });
        // Reset form
        setName('');
        setLocation('');
        setSiteId(sites.length > 0 ? sites[0].id : 0);
        setCategory(EQUIPMENT_CATEGORIES.length > 0 ? EQUIPMENT_CATEGORIES[0] : '');
        setStatus(EquipmentStatus.Operativo);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Aggiungi Nuova Attrezzatura</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Attrezzatura</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                        </div>
                         <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
                            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" required>
                                {EQUIPMENT_CATEGORIES.map((cat: string) => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Ubicazione</label>
                            <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="site" className="block text-sm font-medium text-gray-700">Sito</label>
                            <select id="site" value={siteId} onChange={(e) => setSiteId(Number(e.target.value))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" required>
                                {sites.map((site: Site) => <option key={site.id} value={site.id}>{site.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Stato</label>
                            <select id="status" value={status} onChange={(e) => setStatus(e.target.value as EquipmentStatus)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                {Object.values(EquipmentStatus).map((s: string) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Annulla
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Salva Attrezzatura
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EquipmentPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { sites, findSiteName, loading: contextLoading } = useData();

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.from('equipment').select('*').order('name', { ascending: true });
        if (error) throw error;
        setEquipmentList(data as Equipment[]);
      } catch (e: any) {
        console.error("Fetch error:", e);
        setError(e.message || 'Errore sconosciuto');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const handleAddNewEquipment = async (newEquipmentData: Omit<Equipment, 'id' | 'last_maintenance' | 'floor_plan_id' | 'position'>) => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('equipment')
        .insert([newEquipmentData])
        .select();
      
      if (error) throw error;

      if (data) {
        setEquipmentList(prevList => [data[0] as Equipment, ...prevList]);
      }
      setIsModalOpen(false);
    } catch (e: any) {
      console.error("Save error:", e);
      setError(`Salvataggio fallito: ${e.message}`);
    }
  };
  
  const filteredEquipment = useMemo(() => {
    if (!searchTerm) return equipmentList;
    const term = searchTerm.toLowerCase();
    return equipmentList.filter(
      eq => eq.name.toLowerCase().includes(term) ||
             eq.id.toLowerCase().includes(term) ||
             eq.category.toLowerCase().includes(term)
    );
  }, [searchTerm, equipmentList]);

  const pageLoading = loading || contextLoading;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Anagrafica Attrezzature</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
          <IconPlusCircle className="h-5 w-5 mr-2" />
          Aggiungi Attrezzatura
        </button>
      </div>

      {error && (
         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p className="font-bold">Errore</p>
            <p>{error}</p>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <input 
              type="search" 
              placeholder="Cerca per nome, codice o categoria..." 
              className="w-72 pl-4 pr-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="flex items-center text-sm text-gray-600 bg-white border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50">
              <IconFilter className="h-4 w-4 mr-2" />
              Filtri
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {pageLoading ? (
             <div className="text-center p-8">Caricamento attrezzature in corso...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Codice</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sito</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ultima Manut.</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEquipment.map((item: Equipment) => (
                  <tr key={item.id} onClick={() => window.location.hash = `#/equipment/${item.id}`} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{findSiteName(item.site_id)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status as EquipmentStatus)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.last_maintenance || 'N/D'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <NewEquipmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddNewEquipment}
        sites={sites}
      />
    </div>
  );
};

export default EquipmentPage;