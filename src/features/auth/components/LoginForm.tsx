import { useNavigate } from "react-router-dom";
import { useAuth, useAuthActions } from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import { userLoginDTO } from "../../../types/user/userRequest";

interface LoginFormProps {
  setIsLoginMode: React.Dispatch<React.SetStateAction<boolean>>;
}

function LoginForm({ setIsLoginMode }: LoginFormProps) {
  const navigate = useNavigate();
  const { error, isAuthenticated } = useAuth();
  const { login, clearError } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const userData: userLoginDTO = {
      email,
      password,
    };

    await login(userData);
  };

  return (
    <div className="card">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Iniciar sesión
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Inicia sesión para empezar a estudiar
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base w-full"
              placeholder="Correo electrónico"
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base w-full"
              placeholder="Contraseña (mínimo 6 caracteres)"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={useAuth().isLoading}
            className="btn-primary w-full flex justify-center"
          >
            {useAuth().isLoading ? "Procesando..." : "Iniciar sesión"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLoginMode(false)}
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
