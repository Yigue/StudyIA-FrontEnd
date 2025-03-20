interface AuthFormProps {
  email: string;
  password: string;
  isSignUp: boolean;
  loading: boolean;
  error: string | null;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleMode: () => void;
}

export const AuthForm = ({
  email,
  password,
  isSignUp,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onToggleMode,
}: AuthFormProps) => (
  <div className="max-w-md w-full space-y-8">
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {isSignUp ? 'Crear una cuenta' : 'Iniciar sesión'}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        {isSignUp ? 'Crea tu cuenta para empezar a estudiar' : 'Ingresa a tu cuenta para continuar'}
      </p>
    </div>
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
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
            onChange={(e) => onEmailChange(e.target.value)}
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
            onChange={(e) => onPasswordChange(e.target.value)}
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
        onClick={onToggleMode}
        className="text-indigo-600 hover:text-indigo-500"
      >
        {isSignUp
          ? '¿Ya tienes una cuenta? Inicia sesión'
          : '¿No tienes una cuenta? Regístrate'}
      </button>
    </div>
  </div>
);
