import React, { useState } from 'react';
import { Copy, BookOpen, FileText, Check, Download, RefreshCw } from 'lucide-react';
import { AnalysisResult } from '../types/study.types';

interface AnalysisResultsProps {
  analysisResult: AnalysisResult | null;
  isGenerating?: boolean;
}

const AnalysisResultsComponent: React.FC<AnalysisResultsProps> = ({ 
  analysisResult, 
  isGenerating = false 
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards'>('summary');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Si no hay resultados y no se está generando nada, no mostrar el componente
  if (!analysisResult && !isGenerating) return null;

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const downloadSummary = () => {
    if (!analysisResult) return;
    
    const content = analysisResult.summary;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadFlashcards = () => {
    if (!analysisResult) return;
    
    const content = analysisResult.flashcards
      .map((card, index) => `Card ${index + 1}:\nQ: ${card.question}\nA: ${card.answer}\n`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Componente para mostrar cuando se está generando contenido
  if (isGenerating) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full p-4 mb-4">
            <RefreshCw className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Generando contenido
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Estamos procesando tu material para crear un resumen y flashcards. 
            Esto puede tomar un momento dependiendo del tamaño del documento.
          </p>
        </div>
      </div>
    );
  }

  // Si llegamos aquí, sabemos que analysisResult existe
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-3 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'summary'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <FileText className="w-4 h-4" />
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-3 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'flashcards'
                ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Flashcards ({analysisResult!.flashcards.length})
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'summary' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Resumen</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(analysisResult!.summary, 'summary')}
                  className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Copiar al portapapeles"
                >
                  {copiedSection === 'summary' ? (
                    <Check className="w-5 h-5 text-green-500 dark:text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={downloadSummary}
                  className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Descargar como archivo de texto"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-gray-800 dark:text-gray-200 text-sm">
                {analysisResult!.summary}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'flashcards' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Flashcards</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(
                    analysisResult!.flashcards
                      .map((card, index) => `Tarjeta ${index + 1}:\nPregunta: ${card.question}\nRespuesta: ${card.answer}`)
                      .join('\n\n'),
                    'flashcards'
                  )}
                  className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Copiar al portapapeles"
                >
                  {copiedSection === 'flashcards' ? (
                    <Check className="w-5 h-5 text-green-500 dark:text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={downloadFlashcards}
                  className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Descargar como archivo de texto"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {analysisResult!.flashcards.map((card, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Pregunta {index + 1}</h4>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-800 dark:text-gray-200">{card.question}</p>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Respuesta:</span> {card.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResultsComponent;