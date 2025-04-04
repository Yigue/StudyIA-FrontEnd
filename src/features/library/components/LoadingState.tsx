import React from "react";

export const LoadingState: React.FC = () => {
  return (
    <div className="h-screen bg-[#0f172a] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block relative w-20 h-20 mb-5">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-indigo-500/20 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-indigo-500 animate-spin"></div>
        </div>
        <h2 className="text-xl font-semibold mb-2">Cargando materiales</h2>
        <p className="text-gray-400">Por favor, espere un momento mientras preparamos su biblioteca</p>
      </div>
    </div>
  );
}; 