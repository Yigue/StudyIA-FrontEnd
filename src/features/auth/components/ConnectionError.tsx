import { ConnectionError } from '../types/auth.types';

interface ConnectionErrorProps extends ConnectionError {
  onRetry: () => void;
}

export const ConnectionErrorComponent = ({ message, onRetry }: ConnectionErrorProps) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8 text-center">
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {message}
      </div>
      <button
        onClick={onRetry}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Reintentar conexión
      </button>
    </div>
  </div>
);
