import React, { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { FileText, ChevronDown, ChevronUp, Book } from "lucide-react";
import { Summary } from "@/types";

interface SummaryListProps {
  summaries: Summary[];
}

export const SummaryList: React.FC<SummaryListProps> = ({ summaries }) => {
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);

  if (summaries.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="bg-gray-800/50 rounded-full p-4 mb-4">
          <FileText className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">
          No hay resúmenes disponibles
        </h3>
        <p className="text-gray-400 text-sm text-center max-w-md">
          Genera resúmenes usando la opción "Generar Contenido" en este material
          para crear resúmenes automáticamente.
        </p>
      </div>
    );
  }

  // Alternar expansión del resumen
  const toggleExpand = (summaryId: string) => {
    setExpandedSummaryId(currentId => 
      currentId === summaryId ? null : summaryId
    );
  };

  // Formatear fecha de forma segura
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Fecha desconocida";
    
    try {
      return new Date(dateString).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch (_) {
      return "Fecha desconocida";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2 px-2">
        <Book className="w-5 h-5 text-indigo-400 mr-2" />
        <h2 className="text-lg font-medium">Resúmenes disponibles</h2>
      </div>
      
      {summaries.map((summary, index) => (
        <div key={summary.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div 
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-750 transition-colors"
            onClick={() => toggleExpand(summary.id)}
          >
            <div className="flex items-center">
              <div className="bg-indigo-900/30 p-2 rounded-md mr-3">
                <FileText className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-medium">
                  {`Resumen ${index + 1}`}
                </h3>
                <p className="text-xs text-gray-400">
                  {formatDate(summary.createdAt)}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
            >
              {expandedSummaryId === summary.id ? 
                <ChevronUp className="h-5 w-5" /> : 
                <ChevronDown className="h-5 w-5" />}
            </Button>
          </div>
          
          {expandedSummaryId === summary.id && (
            <div className="p-4 border-t border-gray-700 bg-gray-850 animate-fadeIn">
              <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-gray-200 prose-pre:bg-gray-900 prose-pre:text-gray-300 prose-strong:text-white">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {summary.content}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 