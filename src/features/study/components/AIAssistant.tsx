import React from 'react';
import { Sparkles, RotateCw } from 'lucide-react';

interface AIAssistantProps {
  isAnalyzing: boolean;
  onAnalyze: () => void;
  isDisabled: boolean;
  generationMode: 'both' | 'summary' | 'flashcards';
  setGenerationMode: (mode: 'both' | 'summary' | 'flashcards') => void;
}

const AIAssistantComponent: React.FC<AIAssistantProps> = ({
  isAnalyzing,
  onAnalyze,
  isDisabled,
  generationMode,
  setGenerationMode
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">Asistente IA</h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        Nuestro asistente de IA puede generar materiales de estudio personalizados basados en tu contenido. Selecciona qué tipo de contenido quieres generar:
      </p>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setGenerationMode('both')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex-1 border transition-all ${
            generationMode === 'both'
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Ambos
        </button>
        <button
          onClick={() => setGenerationMode('summary')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex-1 border transition-all ${
            generationMode === 'summary'
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Solo Resumen
        </button>
        <button
          onClick={() => setGenerationMode('flashcards')}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex-1 border transition-all ${
            generationMode === 'flashcards'
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Solo Flashcards
        </button>
      </div>
      
      <button
        onClick={onAnalyze}
        disabled={isDisabled || isAnalyzing}
        className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all 
          ${isDisabled || isAnalyzing 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-sm hover:shadow'
          }`}
      >
        {isAnalyzing ? (
          <>
            <RotateCw className="w-5 h-5 animate-spin" />
            Analizando contenido...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generar con IA
          </>
        )}
      </button>
      
      {!isAnalyzing && !isDisabled && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-indigo-50 rounded-lg text-center">
            <div className="font-medium text-indigo-700 mb-1">Resúmenes</div>
            <div className="text-xs text-gray-600">Condensa la información clave</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg text-center">
            <div className="font-medium text-purple-700 mb-1">Flashcards</div>
            <div className="text-xs text-gray-600">Crea tarjetas de estudio</div>
          </div>
          <div className="p-3 bg-pink-50 rounded-lg text-center">
            <div className="font-medium text-pink-700 mb-1">Análisis</div>
            <div className="text-xs text-gray-600">Extrae conceptos clave</div>
          </div>
        </div>
      )}
      
      {isAnalyzing && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Este proceso puede tardar hasta 30 segundos dependiendo del tamaño del contenido
        </div>
      )}
    </div>
  );
};

export default AIAssistantComponent;
