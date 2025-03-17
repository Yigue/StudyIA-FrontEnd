import  { useState } from 'react';
import { supabase } from '../lib/supabase';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return null;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let authResponse;
      
      if (isSignUp) {
        authResponse = await supabase.auth.signUp({
          email,
          password,
        });
      } else {
        authResponse = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }

      if (authResponse.error) throw authResponse.error;
      
      // Si el registro fue exitoso
      if (isSignUp && authResponse.data?.user) {
        setError('Por favor verifica tu correo electrónico para continuar');
      }
      
    } catch (error) {
      console.error('Auth error:', error);
      let message = 'Ha ocurrido un error';
      
      if (error.message.includes('weak-password')) {
        message = 'La contraseña debe tener al menos 6 caracteres';
      } else if (error.message.includes('invalid-credentials')) {
        message = 'Correo electrónico o contraseña incorrectos';
      } else if (error.message.includes('not-confirmed')) {
        message = 'Por favor, confirma tu correo electrónico';
      } else if (error.message.includes('already-registered')) {
        message = 'Este correo electrónico ya está registrado';
      } else if (error.message.includes('invalid-email')) {
        message = 'Por favor, ingresa un correo electrónico válido';
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Crear una cuenta' : 'Iniciar sesión'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignUp ? 'Crea tu cuenta para empezar a estudiar' : 'Ingresa a tu cuenta para continuar'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Correo electrónico</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña (mínimo 6 caracteres)"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? 'Procesando...' : isSignUp ? 'Registrarse' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setEmail('');
              setPassword('');
            }}
            className="text-indigo-600 hover:text-indigo-500"
          >
            {isSignUp
              ? '¿Ya tienes una cuenta? Inicia sesión'
              : '¿No tienes una cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;