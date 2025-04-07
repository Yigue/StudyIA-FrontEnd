import React from 'react';
import { Sparkles, FileText, BookOpen, AlertCircle, Upload, Check, Clock } from 'lucide-react';
import { useStudyContext } from '../context/StudyContext';
import { GenerationMode } from '../context/StudyContext';

/**
 * Botón de generación para un tipo específico de contenido
 */
interface GenerationButtonProps {
  active: boolean;
  mode: GenerationMode;
  label: string;
  icon: React.ReactNode;
  onClick: (mode: GenerationMode) => void;
  disabled?: boolean;
}

const GenerationButton: React.FC<GenerationButtonProps> = ({
  active,
  mode,
  label,
  icon,
  onClick,
  disabled = false
}) => {
  return (
    <button
      className={`relative p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-all
        ${active 
          ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700 dark:bg-indigo-900/40 dark:border-indigo-400 dark:text-indigo-300' 
          : 'bg-white border border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50/50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/30'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={() => !disabled && onClick(mode)}
      disabled={disabled}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-sm font-medium">{label}</div>
      
      {active && (
        <div className="absolute -top-2 -right-2 bg-indigo-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs dark:bg-indigo-600">
          <Sparkles className="w-3 h-3" />
        </div>
      )}
    </button>
  );
};

/**
 * Componente principal para los controles de generación de contenido
 */
const ContentGenerationControls: React.FC = () => {
  const { state, dispatch, isGenerating, canGenerateContent } = useStudyContext();
  const { generationMode, materialUploaded, processingStatus, isLoading, analysisResult } = state;
  
  // Verificar si hay material válido para cargar
  const hasMaterial = state.files.length > 0 || state.text.trim().length > 0;
  
  // Determinar si los controles deben estar deshabilitados
  const controlsDisabled = isLoading || processingStatus === 'pending' || !materialUploaded;
  
  // Handler para cambiar el modo de generación
  const handleSetMode = (mode: GenerationMode) => {
    // Solo permitir cambiar si no está generando o cargando
    if (!isLoading && processingStatus !== 'pending') {
      dispatch({ type: 'SET_GENERATION_MODE', payload: mode });
    }
  };
  
  // Handler para iniciar la generación de contenido
  const handleGenerateContent = () => {
    if (canGenerateContent) {
      // Emitir evento para generar contenido
      const event = new CustomEvent('generateContent');
      document.dispatchEvent(event);
    }
  };

  // Renderizar mensaje de estado del material
  const renderMaterialStatus = () => {
    if (!hasMaterial) {
      return (
        <div className="flex items-center gap-2 text-amber-600 text-sm mt-2 dark:text-amber-400">
          <AlertCircle className="w-4 h-4" />
          <span>Primero debes cargar un archivo o ingresar texto</span>
        </div>
      );
    }
    
    if (!materialUploaded) {
      return (
        <div className="flex items-center gap-2 text-amber-600 text-sm mt-2 dark:text-amber-400">
          <Upload className="w-4 h-4" />
          <span>El material aún no ha sido subido</span>
        </div>
      );
    }
    
    if (analysisResult) {
      return (
        <div className="flex items-center gap-2 text-green-600 text-sm mt-2 dark:text-green-400">
          <Check className="w-4 h-4" />
          <span>El material ya ha sido analizado</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 text-indigo-600 text-sm mt-2 dark:text-indigo-400">
        <Clock className="w-4 h-4" />
        <span>Material listo para ser analizado</span>
      </div>
    );
  };
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Tipo de Contenido a Generar</h3>
      
      <div className="grid grid-cols-3 gap-3 mb-4">
        <GenerationButton
          active={generationMode === 'both'}
          mode="both"
          label="Ambos"
          icon={<Sparkles className="text-indigo-500 dark:text-indigo-400" />}
          onClick={handleSetMode}
          disabled={controlsDisabled}
        />
        
        <GenerationButton
          active={generationMode === 'summary'}
          mode="summary"
          label="Resumen"
          icon={<FileText className="text-blue-500 dark:text-blue-400" />}
          onClick={handleSetMode}
          disabled={controlsDisabled}
        />
        
        <GenerationButton
          active={generationMode === 'flashcards'}
          mode="flashcards"
          label="Flashcards"
          icon={<BookOpen className="text-green-500 dark:text-green-400" />}
          onClick={handleSetMode}
          disabled={controlsDisabled}
        />
      </div>
      
      {renderMaterialStatus()}
      
      {/* Botón principal de generación */}
      <button
        onClick={handleGenerateContent}
        disabled={!canGenerateContent || isLoading}
        className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 mt-4 ${
          !canGenerateContent || isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
        }`}
      >
        <Sparkles className="w-5 h-5" />
        {isGenerating ? 'Generando...' : 'Generar Contenido'}
      </button>
      
      <p className="text-xs text-gray-500 mt-3 dark:text-gray-400">
        Selecciona qué tipo de contenido quieres generar a partir del material subido.
      </p>
    </div>
  );
};

export default ContentGenerationControls; 