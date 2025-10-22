import React, { useState, FormEvent, useEffect } from 'react';
import { useData } from '../contexts/DataContext.tsx';
import { supabase } from '../supabaseClient.ts';
import { Company } from '../types.ts';
import { IconPlusCircle } from '../components/icons.tsx';

type Site = { id: number; name: string; company_id: number };

const NewCompanyModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Il nome non può essere vuoto.');
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            const { error } = await supabase.from('companies').insert({ name });
            if (error) throw error;
            onSuccess();
            onClose();
            setName('');
        } catch (e: any) {
            setError(e.message || 'Errore durante il salvataggio.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuova Azienda</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">Nome Azienda</label>
                    <input
                        id="company-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50">Annulla</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50">{isSubmitting ? 'Salvataggio...' : 'Salva'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const NewSiteModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    companies: Company[];
}> = ({ isOpen, onClose, onSuccess, companies }) => {
    const [name, setName] = useState('');
    const [companyId, setCompanyId] = useState<number | ''>('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && companies.length > 0) {
            setCompanyId(companies[0].id);
        } else if (isOpen) {
            setCompanyId('');
        }
    }, [isOpen, companies]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !companyId) {
            setError('Tutti i campi sono obbligatori.');
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            const { error } = await supabase.from('sites').insert({ name, company_id: Number(companyId) });
            if (error) throw error;
            onSuccess();
            onClose();
            setName('');
        } catch (e: any) {
            setError(e.message || 'Errore durante il salvataggio.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuovo Sito</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="site-name" className="block text-sm font-medium text-gray-700">Nome Sito</label>
                        <input id="site-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    <div>
                        <label htmlFor="company-select" className="block text-sm font-medium text-gray-700">Azienda di Appartenenza</label>
                        <select id="company-select" value={companyId} onChange={(e) => setCompanyId(Number(e.target.value))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" required>
                            {companies.length === 0 ? (
                                <option disabled>Nessuna azienda, creane una prima.</option>
                            ) : (
                                companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                            )}
                        </select>
                    </div>
                    <div className="pt-2 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50">Annulla</button>
                        <button type="submit" disabled={isSubmitting || companies.length === 0} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50">{isSubmitting ? 'Salvataggio...' : 'Salva'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('aziende');
    const { companies, sites, loading, error, reloadData } = useData();
    const [isCompanyModalOpen, setCompanyModalOpen] = useState(false);
    const [isSiteModalOpen, setSiteModalOpen] = useState(false);
    
    if (loading) {
        return <div className="text-center p-8">Caricamento impostazioni...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Impostazioni</h1>
            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{error}</p></div>}

            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                        <button onClick={() => setActiveTab('aziende')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'aziende' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Aziende ({companies.length})
                        </button>
                        <button onClick={() => setActiveTab('siti')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'siti' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Siti ({sites.length})
                        </button>
                    </nav>
                </div>
                
                {activeTab === 'aziende' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Elenco Aziende</h2>
                            <button onClick={() => setCompanyModalOpen(true)} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition text-sm">
                                <IconPlusCircle className="h-5 w-5 mr-2" />
                                Aggiungi Azienda
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome Azienda</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {companies.map((company) => (
                                        <tr key={company.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'siti' && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Elenco Siti</h2>
                            <button onClick={() => setSiteModalOpen(true)} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition text-sm">
                                <IconPlusCircle className="h-5 w-5 mr-2" />
                                Aggiungi Sito
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome Sito</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azienda</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {(sites as Site[]).map((site) => {
                                        const company = companies.find(c => c.id === site.company_id);
                                        return (
                                            <tr key={site.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{site.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{site.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company?.name || 'N/D'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <NewCompanyModal isOpen={isCompanyModalOpen} onClose={() => setCompanyModalOpen(false)} onSuccess={reloadData} />
            <NewSiteModal isOpen={isSiteModalOpen} onClose={() => setSiteModalOpen(false)} onSuccess={reloadData} companies={companies} />
        </div>
    );
};

export default Settings;