import React, { useState, useEffect } from 'react';
import { Equipment, EquipmentStatus } from '../types.ts';
import { IconArrowLeft } from '../components/icons.tsx';
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

const DetailItem: React.FC<{label: string; children: React.ReactNode}> = ({label, children}) => (
    <div>
        <h4 className="text-xs text-gray-500 uppercase font-semibold tracking-wider">{label}</h4>
        <div className="text-base text-gray-800 mt-1">{children}</div>
    </div>
);

const EquipmentDetail: React.FC<{ id: string }> = ({ id }) => {
    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { sites, companies, loading: contextLoading } = useData();

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                setLoading(true);
                setError(null);
                const { data, error } = await supabase
                    .from('equipment')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setEquipment(data as Equipment);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchEquipment();
        }
    }, [id]);

    if (loading || contextLoading) {
        return <div>Caricamento dati attrezzatura...</div>;
    }

    if (error) {
        return <div>Errore: {error}</div>;
    }

    if (!equipment) {
         return (
            <div>
                <h1 className="text-2xl font-bold">Attrezzatura non trovata</h1>
                <p>L'attrezzatura che stai cercando non esiste.</p>
                <button onClick={() => window.location.hash = '#/equipment'} className="mt-4 text-indigo-600 hover:text-indigo-800">Torna all'anagrafica</button>
            </div>
        );
    }

    const site = sites.find(s => s.id === equipment.site_id);
    const company = companies.find(c => c.id === site?.company_id);

    return (
        <div>
            <div className="mb-6">
                <button onClick={() => window.location.hash = '#/equipment'} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
                    <IconArrowLeft className="h-4 w-4 mr-2" />
                    Torna all'anagrafica attrezzature
                </button>
            </div>

             <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start pb-4 border-b border-gray-200">
                    <div>
                        <p className="text-sm text-indigo-600 font-semibold">Attrezzatura #{equipment.id}</p>
                        <h2 className="text-2xl font-bold text-gray-900 mt-1">{equipment.name}</h2>
                    </div>
                </div>
                
                <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <DetailItem label="Stato Operativo">
                        <span className={`px-2.5 py-0.5 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(equipment.status as EquipmentStatus)}`}>
                            {equipment.status}
                        </span>
                    </DetailItem>
                    <DetailItem label="Categoria">{equipment.category}</DetailItem>
                    <DetailItem label="Azienda">{company?.name || 'N/D'}</DetailItem>
                    <DetailItem label="Sito">{site?.name || 'N/D'}</DetailItem>
                    <DetailItem label="Ubicazione">{equipment.location}</DetailItem>
                    <DetailItem label="Ultima Manutenzione">{equipment.last_maintenance || 'N/D'}</DetailItem>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200 space-x-3">
                    <button type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Vedi Storico
                    </button>
                    <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Modifica
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EquipmentDetail;