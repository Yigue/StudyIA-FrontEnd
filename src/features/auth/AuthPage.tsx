import { useAuth } from "../../hook/useAuth";
import { Navigate } from "react-router-dom";
import { ConnectionErrorComponent } from "./components/ConnectionError";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import { useState } from "react";


const AuthPage = () => {

  const { isAuthenticated } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  if (connectionError) {
    return (
      <ConnectionErrorComponent
        message={connectionError}
        onRetry={() => setConnectionError(null)}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {isLoginMode ? (
        <LoginForm setIsLoginMode={setIsLoginMode} />
      ) : (
        <RegisterForm setIsLoginMode={setIsLoginMode} />
      )}
    </div>
  );
};

export default AuthPage;

