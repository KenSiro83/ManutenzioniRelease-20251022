import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types_db.ts';

// Questo blocco gestisce le variabili d'ambiente in due contesti diversi:
// 1. In un ambiente Vite (come Vercel), usa `import.meta.env`.
// 2. Nella sandbox di AI Studio, usa un oggetto `process.env` finto definito in `index.html`.
// FIX: Property 'env' does not exist on type 'ImportMeta'. Cast to any to bypass type checking for Vite env variables.
const env = ((import.meta as any).env?.VITE_SUPABASE_URL ? (import.meta as any).env : (window as any).process?.env) || {};

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient<Database>;
let supabaseInitializationError: string | null = null;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("INSERISCI")) {
  supabaseInitializationError = 'Chiavi Supabase non trovate o non valide. Assicurati di averle inserite correttamente nel file index.html.';
  // Creiamo un client fittizio per evitare errori di tipo in tutta l'app.
  // Questo client non verrà mai usato perché l'app mostrerà un errore di setup.
  supabaseInstance = createClient<Database>('http://localhost:54321', 'fake-key');
} else {
  // Crea e esporta il client Supabase reale
  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseInstance;
export const supabaseError = supabaseInitializationError;