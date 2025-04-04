import React from "react";
import { FileText, FileIcon, Calendar, Clock, Tag, ExternalLink } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/badge";
import { Summary, StudyMaterial } from "@/types";
import { formatDate } from "../utils/dateUtils";

interface MaterialDetailProps {
  material: StudyMaterial;
  summaries: Summary[];
  onViewFile?: (fileUrl: string) => void;
}

export const MaterialDetail: React.FC<MaterialDetailProps> = ({
  material,
  summaries,
  onViewFile
}) => {
  // Obtener resumen principal
  const mainSummary = summaries && summaries.length > 0 ? summaries[0] : null;
  
  // Determinar si hay texto o archivo para mostrar
  const hasContent = material.content || (material.file_url && material.file_url.length > 0);
  
  // Formatear tipos de archivo para mostrar
  const getFileTypeLabel = (fileType?: string) => {
    if (!fileType) return "Documento";
    
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return "PDF";
    if (type.includes('doc')) return "Documento Word";
    if (type.includes('text')) return "Texto";
    if (type.includes('image')) return "Imagen";
    return "Archivo";
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Metadatos del material */}
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="bg-gray-700 rounded-xl h-32 w-32 flex items-center justify-center shrink-0 mx-auto md:mx-0">
            {material.file_url ? (
              <FileIcon className="h-14 w-14 text-indigo-400" />
            ) : (
              <FileText className="h-14 w-14 text-indigo-400" />
            )}
          </div>
          
          <div className="flex-grow">
            <h2 className="text-xl font-bold mb-1">{material.title}</h2>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {material.file_type && (
                <Badge className="bg-indigo-900/50 text-indigo-300 hover:bg-indigo-900/70">
                  {getFileTypeLabel(material.file_type)}
                </Badge>
              )}
              
              {material.status && (
                <Badge className="bg-emerald-900/50 text-emerald-300 hover:bg-emerald-900/70">
                  {material.status}
                </Badge>
              )}
              
              {material.tags && material.tags.length > 0 && 
                material.tags.map((tag, index) => (
                  <Badge key={index} className="bg-gray-700 hover:bg-gray-600">
                    {typeof tag === 'string' ? tag : tag.name || 'Tag'}
                  </Badge>
                ))
              }
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center text-gray-400">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Creado: {formatDate(material.createdAt || material.created_at)}</span>
          </div>
          
          {(material.updatedAt || material.updated_at) && (
            <div className="flex items-center text-gray-400">
              <Clock className="h-4 w-4 mr-2" />
              <span>Actualizado: {formatDate(material.updatedAt || material.updated_at)}</span>
            </div>
          )}
          
          {material.language && (
            <div className="flex items-center text-gray-400">
              <Tag className="h-4 w-4 mr-2" />
              <span>Idioma: {material.language}</span>
            </div>
          )}
          
          {material.page_count && (
            <div className="flex items-center text-gray-400">
              <FileText className="h-4 w-4 mr-2" />
              <span>Páginas: {material.page_count}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Acciones para visualizar el archivo */}
      {material.file_url && (
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <h3 className="font-medium mb-3">Archivo disponible</h3>
          <div className="flex flex-col md:flex-row gap-2">
            <Button 
              onClick={() => onViewFile && onViewFile(material.file_url || "")}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver documento
            </Button>
            
            <Button 
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-700"
              onClick={() => window.open(material.file_url, "_blank")}
            >
              Descargar
            </Button>
          </div>
        </div>
      )}
      
      {/* Contenido del material */}
      {hasContent ? (
        <div className="bg-gray-800 rounded-lg p-4 flex-grow overflow-y-auto">
          <h3 className="font-medium mb-3">Contenido</h3>
          
          {material.content ? (
            <div className="whitespace-pre-wrap text-gray-300 text-sm">
              {material.content}
            </div>
          ) : mainSummary ? (
            <div className="whitespace-pre-wrap text-gray-300 text-sm">
              {mainSummary.content}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>Usa la opción "Generar Contenido" para crear resúmenes y flashcards</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-6 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="bg-gray-700 rounded-full p-3 inline-block mb-3">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No hay contenido disponible</h3>
            <p className="text-gray-400 text-sm max-w-md">
              Este material no tiene contenido textual para mostrar. 
              Puedes generar resúmenes y flashcards usando la opción "Generar Contenido".
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
