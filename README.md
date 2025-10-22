# Gestionale Manutenzioni

Software gestionale per la manutenzione di impianti e attrezzature industriali.

## Setup e Avvio

Questo progetto è costruito con Vite, React, TypeScript e Supabase.

### 1. Installazione Dipendenze

Per installare tutte le librerie necessarie, esegui questo comando nella cartella principale del progetto:

```bash
npm install
```

### 2. Variabili d'Ambiente

Crea un file chiamato `.env.local` nella cartella principale del progetto. Copia il contenuto di `.env.example` e inserisci le tue chiavi Supabase.

```
VITE_SUPABASE_URL="IL_TUO_URL_SUPABASE"
VITE_SUPABASE_ANON_KEY="LA_TUA_CHIAVE_ANON_SUPABASE"
```

### 3. Avvio del Server di Sviluppo

Per avviare l'applicazione in modalità sviluppo (si aggiornerà automaticamente quando salvi un file), esegui:

```bash
npm run dev
```

L'applicazione sarà visibile all'indirizzo `http://localhost:5173`.
