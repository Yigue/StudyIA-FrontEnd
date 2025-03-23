import React, { useState } from 'react';
import { BookOpen, FileText, Calendar, Tag as TagIcon, ChevronRight } from 'lucide-react';
import { StudyMaterial, Summary } from '../../../types';
import { Tag } from '../../../types/tag/tag';

interface MaterialDetailProps {
  material: StudyMaterial;
  selectedSummary: Summary[] | null;
}

export const MaterialDetail: React.FC<MaterialDetailProps> = ({
  material,
  selectedSummary,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'summary'>('content');
  
  // Formatear la fecha de creación
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Encabezado del material */}
      <div className="bg-indigo-50 p-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <BookOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {material.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(material.created_at)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {material.tags?.map((tag, index) => (
            <div key={index} className="px-3 py-1 bg-white rounded-full text-xs text-indigo-700 font-medium flex items-center">
              <TagIcon className="w-3 h-3 mr-1" />
              {typeof tag === 'string' ? tag : (tag as Tag).name}
            </div>
          ))}
        </div>
      </div>
      
      {/* Pestañas */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-3 px-5 font-medium flex items-center ${
            activeTab === 'content' 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('content')}
        >
          <FileText className="w-4 h-4 mr-2" />
          Contenido
        </button>
        <button
          className={`py-3 px-5 font-medium flex items-center ${
            activeTab === 'summary' 
              ? 'text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('summary')}
        >
          <ChevronRight className="w-4 h-4 mr-2" />
          Resumen
        </button>
      </div>
      
      {/* Contenido según la pestaña activa */}
      <div className="p-6">
        {activeTab === 'content' ? (
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{material.content}</p>
            
            {material.file_url && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Archivo adjunto</h4>
                <a 
                  href={material.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline text-sm flex items-center"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Ver documento original
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="prose max-w-none">
            {selectedSummary && selectedSummary.length > 0 ? (
              <div className="space-y-6">
                {selectedSummary.map((summary, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-gray-800 font-medium mb-2">Resumen {index + 1}</h4>
                    <p className="text-gray-700 whitespace-pre-line">{summary.summary_text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No hay resúmenes disponibles para este material.</p>
                <p className="text-gray-500 text-sm mt-2">
                  Puedes generar un resumen desde la sección de estudio.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
