import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useAuthActions } from "../../../hook/useAuth";
import { userRegisterDTO } from "../../../types/user/userRequest";

interface RegisterFormProps {
  setIsLoginMode: React.Dispatch<React.SetStateAction<boolean>>;
}

function RegisterForm({ setIsLoginMode }: RegisterFormProps) {
  const navigate = useNavigate();
  const { error, isAuthenticated } = useAuth();
  const { register, clearError } = useAuthActions();

  const [nombre, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      // console.log(isAuthenticated);
      navigate("/dashboard"); // Redirigir a home después de registro exitoso
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const role_id = "f5900301-becf-47cf-8ce3-df4491a9e626";
    const userData: userRegisterDTO = {
      email,
      password,
      nombre,
      role_id,
    };

    await register(userData);
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crear una cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Crea tu cuenta para empezar a estudiar
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="name" className="sr-only">
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              required
              value={nombre}
              onChange={(e) => setName(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nombre completo"
            />
          </div>
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
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Contraseña (mínimo 6 caracteres)"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={useAuth().isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {useAuth().isLoading ? "Procesando..." : "Registrarse"}
          </button>
        </div>
      </form>
      <div className="text-center">
        <button
          onClick={() => setIsLoginMode(true)}
          className="text-indigo-600 hover:text-indigo-500"
        >
          ¿Ya tienes una cuenta? Inicia sesión
        </button>
      </div>
    </div>
  );
}

export default RegisterForm;
