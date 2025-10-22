import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { supabaseError } from './supabaseClient';
import SetupError from './components/SetupError';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Controlla se le chiavi Supabase sono configurate.
// Se non lo sono, mostra un messaggio di errore invece di tentare di avviare l'app.
if (supabaseError) {
  root.render(
    <React.StrictMode>
      <SetupError message={supabaseError} />
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
}