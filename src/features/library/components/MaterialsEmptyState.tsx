import React from "react";
import { FileQuestion } from "lucide-react";

interface MaterialsEmptyStateProps {
  searchTerm?: string;
}

export const MaterialsEmptyState: React.FC<MaterialsEmptyStateProps> = ({ 
  searchTerm = "" 
}) => {
  return (
    <div className="p-8 flex flex-col items-center justify-center text-center">
      <div className="bg-gray-800 rounded-full p-4 mb-4">
        <FileQuestion className="h-8 w-8 text-gray-500" />
      </div>
      
      {searchTerm ? (
        <>
          <h3 className="text-lg font-medium mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-400 text-sm">
            No hay materiales que coincidan con "{searchTerm}".
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Intenta con otra búsqueda o agrega un nuevo material.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium mb-2">
            No hay materiales disponibles
          </h3>
          <p className="text-gray-400 text-sm">
            Añade tu primer material para comenzar a estudiar.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Puedes subir PDFs, textos o documentos para procesarlos.
          </p>
        </>
      )}
    </div>
  );
}; 