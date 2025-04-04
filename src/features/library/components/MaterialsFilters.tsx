import React from "react";
import { Filter } from "lucide-react";

export const MaterialsFilters: React.FC = () => {
  return (
    <div>
      <div className="flex items-center mb-3">
        <Filter className="h-4 w-4 mr-2 text-indigo-400" />
        <h3 className="font-medium text-sm">Filtros</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-400 mb-1">Tipo</p>
          <select className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            <option>Todos los tipos</option>
            <option>Texto</option>
            <option>PDF</option>
            <option>Documentos</option>
          </select>
        </div>
        
        <div>
          <p className="text-xs text-gray-400 mb-1">Estado</p>
          <select className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            <option>Todos los estados</option>
            <option>Con flashcards</option>
            <option>Con resúmenes</option>
            <option>Pendientes</option>
          </select>
        </div>
        
        <div>
          <p className="text-xs text-gray-400 mb-1">Ordenar por</p>
          <select className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
            <option>Fecha (reciente)</option>
            <option>Fecha (antiguo)</option>
            <option>Alfabético (A-Z)</option>
            <option>Alfabético (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  );
}; 