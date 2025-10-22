import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { supabase } from '../supabaseClient.ts';
import { User, Company, Site, FloorPlan, Equipment, MaintenanceRequest, SparePart, PurchaseRequest } from '../types.ts';

interface DataContextType {
    users: User[];
    companies: Company[];
    sites: Site[];
    floorPlans: FloorPlan[];
    equipment: Equipment[];
    maintenanceRequests: MaintenanceRequest[];
    spareParts: SparePart[];
    purchaseRequests: PurchaseRequest[];
    loading: boolean;
    error: string | null;
    reloadData: () => void;
    findUserById: (id: string) => User | undefined;
    findSiteName: (id: number) => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [sites, setSites] = useState<Site[]>([]);
    const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
    const [spareParts, setSpareParts] = useState<SparePart[]>([]);
    const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [
                { data: usersData, error: usersError },
                { data: companiesData, error: companiesError },
                { data: sitesData, error: sitesError },
            ] = await Promise.all([
                supabase.from('users').select('*'),
                supabase.from('companies').select('*'),
                supabase.from('sites').select('*'),
            ]);

            if (usersError) throw usersError;
            if (companiesError) throw companiesError;
            if (sitesError) throw sitesError;

            setUsers(usersData as User[]);
            setCompanies(companiesData as Company[]);
            setSites(sitesData as Site[]);

        } catch (e: any) {
            setError(e.message);
            console.error("Data fetching error:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const findUserById = (id: string) => users.find(u => u.id === id);
    
    const findSiteName = (id: number) => {
        const site = sites.find(s => s.id === id);
        return site ? site.name : 'Sconosciuto';
    };

    const value = {
        users,
        companies,
        sites,
        floorPlans,
        equipment,
        maintenanceRequests,
        spareParts,
        purchaseRequests,
        loading,
        error,
        reloadData: fetchData,
        findUserById,
        findSiteName,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};