import { useAuthActions } from "../../../../hook/userAuth";

export const AccountSection = () => {
const {logout}=useAuthActions()

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Cuenta</h3>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="text"
            value="nombre de usuario"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            disabled
          />
        </div>
        <div>
          <button
            onClick={logout}
            className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 active:bg-red-600 transition ease-in-out duration-150"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

