import React, { useState } from 'react';
import { supabase } from '../supabaseClient.ts';
import { IconWrench, IconEye, IconEyeOff } from '../components/icons.tsx';

const AuthPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAuthAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const authMethod = isLoginView
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: email.split('@')[0], // Genera un nome di default dall'email
              avatar_url: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(email.split('@')[0])}`
            },
          },
        });

    const { error: authError } = await authMethod;

    if (authError) {
      setError(authError.message);
    } else if (!isLoginView) {
      setMessage('Controlla la tua email per il link di verifica!');
    }
    
    setLoading(false);
  };
  
  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    setMessage('');
    setEmail('');
    setPassword('');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center">
            <IconWrench className="h-10 w-auto text-indigo-600" />
            <span className="ml-3 text-2xl font-bold text-gray-800">Sistema Gestione Manutenzioni</span>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-700">
          {isLoginView ? 'Accedi al tuo account' : 'Crea un nuovo account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleAuthAction}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Indirizzo Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                >
                    {showPassword ? (
                        <IconEyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                        <IconEye className="h-5 w-5 text-gray-500" />
                    )}
                </button>
              </div>
            </div>
            
            {isLoginView && (
                 <div className="flex items-center justify-end">
                    <div className="text-sm">
                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Password dimenticata?
                        </a>
                    </div>
                </div>
            )}
            
            {error && <p className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
            {message && <p className="text-center text-sm text-green-600 bg-green-50 p-3 rounded-md">{message}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-indigo-400"
              >
                {loading ? 'Caricamento...' : (isLoginView ? 'Accedi' : 'Crea account')}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
             <p className="text-gray-600">
                {isLoginView ? 'Non hai un account?' : 'Hai già un account?'}
                <button
                    onClick={toggleView}
                    className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
                >
                    {isLoginView ? 'Registrati ora' : 'Accedi'}
                </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;