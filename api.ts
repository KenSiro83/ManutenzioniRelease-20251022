import { supabase } from './supabaseClient';
import { User, Role } from './types';

// Questo servizio gestisce operazioni che richiedono più passaggi o logica complessa.
const apiService = {
  
  // Funzione per creare un NUOVO utente completo (auth + profilo)
  async post<T>(endpoint: string, data: any): Promise<T> {
    if (endpoint === '/users') {
      const { name, email, roles } = data as { name: string; email: string; roles: Role[] };

      // Per lo sviluppo, usiamo una password temporanea. In produzione, questo
      // dovrebbe inviare un invito.
      const tempPassword = `password-${Math.random().toString(36).slice(2)}`;
      
      // 1. Crea l'utente nel sistema di autenticazione di Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
          data: {
            name: name,
            avatar_url: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`
          }
        }
      });

      if (authError) {
        throw new Error(`Errore Auth: ${authError.message}`);
      }
      if (!authData.user) {
        throw new Error('Creazione utente auth fallita.');
      }

      // 2. Il trigger `handle_new_user` ha già creato un profilo base.
      //    Ora lo aggiorniamo con i ruoli corretti, dato che solo un admin può farlo.
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .update({ roles: roles as any }) // `as any` per il tipo jsonb
        .eq('id', authData.user.id)
        .select()
        .single();

      if (profileError) {
        // Se l'aggiornamento del profilo fallisce, dovremmo idealmente cancellare l'utente auth.
        // Questa operazione richiede privilegi di admin e non è sicura dal client.
        throw new Error(`Errore Profilo: ${profileError.message}`);
      }

      return profileData as T;

    } else {
      throw new Error(`Endpoint ${endpoint} non supportato.`);
    }
  }
};

export { apiService };
