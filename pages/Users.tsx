import React, { useState, FormEvent } from 'react';
import { useData } from '../contexts/DataContext.tsx';
import { User, Role } from '../types.ts';
import { IconFilter, IconPlusCircle, IconEdit, IconSave, IconX } from '../components/icons.tsx';
import { apiService } from '../api.ts';

const getRoleColor = (role: Role) => {
    const colors: { [key in Role]?: string } = {
        [Role.Admin]: 'bg-red-100 text-red-800',
        [Role.MaintManagerPeriodic]: 'bg-blue-100 text-blue-800',
        [Role.MaintWorkerPeriodic]: 'bg-blue-100 text-blue-800',
        [Role.MaintManagerExtra]: 'bg-indigo-100 text-indigo-800',
        [Role.MaintWorkerExtra]: 'bg-indigo-100 text-indigo-800',
        [Role.WarehouseManager]: 'bg-green-100 text-green-800',
        [Role.PurchasingManager]: 'bg-yellow-100 text-yellow-800',
        [Role.Requester]: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
};

const NewUserModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (user: Omit<User, 'id' | 'avatar_url'>) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRoleChange = (role: Role) => {
        setSelectedRoles(prev =>
            prev.includes(role)
                ? prev.filter(r => r !== role)
                : [...prev, role]
        );
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || selectedRoles.length === 0) {
            setError('Tutti i campi sono obbligatori.');
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            await onSubmit({ name, email, roles: selectedRoles });
            onClose();
            setName('');
            setEmail('');
            setSelectedRoles([]);
        } catch (e: any) {
            setError(e.message || 'Errore durante il salvataggio.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Aggiungi Nuovo Utente</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="user-name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input id="user-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    <div>
                        <label htmlFor="user-email" className="block text-sm font-medium text-gray-700">Indirizzo Email</label>
                        <input id="user-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ruoli</label>
                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 p-4 border border-gray-200 rounded-md">
                            {Object.values(Role).map(role => (
                                <div key={role} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`new-user-role-${role}`}
                                        checked={selectedRoles.includes(role)}
                                        onChange={() => handleRoleChange(role)}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor={`new-user-role-${role}`} className="ml-2 text-sm text-gray-600">{role}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="pt-2 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50">Annulla</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50">{isSubmitting ? 'Salvataggio...' : 'Salva Utente'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const Users: React.FC = () => {
    const { users: initialUsers, loading, error, reloadData } = useData();
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [editedRoles, setEditedRoles] = useState<Role[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    
    // Sync local state when context data changes
    React.useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    const handleEdit = (user: User) => {
        setEditingUserId(user.id);
        setEditedRoles([...user.roles]);
    };

    const handleCancel = () => {
        setEditingUserId(null);
        setEditedRoles([]);
    };

    const handleSave = (userId: string) => {
        // Here you would typically make an API call to update the user
        // For now, we update the local state and the context data mock
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex > -1) {
            const updatedUsers = [...users];
            updatedUsers[userIndex].roles = editedRoles;
            setUsers(updatedUsers);
        }
        handleCancel();
    };
    
    const handleAddNewUser = async (newUserData: Omit<User, 'id' | 'avatar_url'>) => {
        setSaveError(null);
        try {
            const savedUser = await apiService.post<User>('/users', newUserData);
            setUsers(prev => [savedUser, ...prev]);
            // Optionally, force a full reload of context data to ensure sync
            // await reloadData(); 
        } catch (e: any) {
             setSaveError(e.message);
             // Re-throw to show error in modal
             throw e;
        }
    };


    const handleRoleChange = (role: Role) => {
        setEditedRoles(prev => 
            prev.includes(role) 
                ? prev.filter(r => r !== role)
                : [...prev, role]
        );
    };

  if (loading) {
    return <div className="text-center p-8">Caricamento utenti...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Utenti e Ruoli</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
          <IconPlusCircle className="h-5 w-5 mr-2" />
          Aggiungi Utente
        </button>
      </div>
      
       {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{error}</p></div>}
       {saveError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>Errore Salvataggio: {saveError}</p></div>}


      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <input type="search" placeholder="Cerca per nome o email..." className="w-72 pl-4 pr-4 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"/>
            <button className="flex items-center text-sm text-gray-600 bg-white border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50">
              <IconFilter className="h-4 w-4 mr-2" />
              Filtra per Ruolo
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utente</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruoli</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user: User) => {
                const isEditing = editingUserId === user.id;
                return (
                    <tr key={user.id} className={`${isEditing ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={user.avatar_url} alt={user.name} />
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {isEditing ? (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {Object.values(Role).map(role => (
                                    <div key={role} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`role-${user.id}-${role}`}
                                            checked={editedRoles.includes(role)}
                                            onChange={() => handleRoleChange(role)}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        <label htmlFor={`role-${user.id}-${role}`} className="ml-2 text-sm text-gray-600">{role}</label>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-1">
                                {user.roles.map(role => (
                                    <span key={role} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(role)}`}>
                                        {role}
                                    </span>
                                ))}
                            </div>
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {isEditing ? (
                            <div className="flex items-center justify-end space-x-3">
                                <button onClick={() => handleSave(user.id)} className="text-green-600 hover:text-green-800" title="Salva">
                                    <IconSave className="w-5 h-5" />
                                </button>
                                <button onClick={handleCancel} className="text-red-600 hover:text-red-800" title="Annulla">
                                    <IconX className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-800" title="Modifica Ruoli">
                                <IconEdit className="w-5 h-5" />
                            </button>
                        )}
                    </td>
                    </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <NewUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddNewUser}
       />
    </div>
  );
};

export default Users;