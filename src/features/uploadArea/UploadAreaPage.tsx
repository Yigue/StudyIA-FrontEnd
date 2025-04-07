import { useEffect, useCallback } from "react";
import { useTags } from "../../hooks/useTags";
import { Subject, AnalysisResult } from "../../types/study";
import { StudyProvider, useStudyContext } from './context/StudyContext';

// Componentes
import StudyInputPanel from './components/StudyInputPanel';
import ContentGenerationControls from './components/ContentGenerationControls';
import AIAssistant from './components/AIAssistant';
import AnalysisResultsComponent from "./components/AnalysisResults";
import NotificationCenter from './components/NotificationCenter';
import { useStudyMaterialProcessing } from './services/studyService';

/**
 * Componente interno que contiene la lógica de la página de estudio
 */
const UploadAreaContent: React.FC = () => {
  // La lógica real se maneja con el contexto
  const { state, isGenerating } = useStudyContext();
  
  // Obtener etiquetas/materias desde el hook
  const { tags } = useTags();
  
  // Convertir tags a Subject para el selector
  const subjects: Subject[] = tags.map((tag) => ({
    id: tag.id,
    name: tag.name
  }));
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        Área de Estudio
      </h1>

      {/* Notificaciones */}
      <NotificationCenter />

      {/* Contenedor principal */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel izquierdo - Entrada de datos */}
        <div className="lg:col-span-7 space-y-6">
          <StudyInputPanel 
            subjects={subjects}
          />
        </div>

        {/* Panel derecho - Controles y resultados */}
        <div className="lg:col-span-5 space-y-6 sticky top-6">
          {/* Componentes de control de IA */}
          <div className="grid grid-cols-1 gap-6">
            <ContentGenerationControls />
            <AIAssistant />
          </div>
          
          {/* Resultados del análisis */}
          <AnalysisResultsComponent 
            analysisResult={state.analysisResult}
            isGenerating={isGenerating}
          />
        </div>
      </section>
    </div>
  );
};

/**
 * Controlador que maneja la lógica de la aplicación
 */
const StudyAreaController: React.FC = () => {
  // Obtener el estado y acciones del contexto
  const { state, dispatch } = useStudyContext();
  
  // Hook para procesar materiales
  const { 
    createMaterial,
    processMaterial,
    isLoading, 
    uploadProgress, 
    processingStatus,
    processingStep
  } = useStudyMaterialProcessing();
  
  // Manejar la subida del material
  const handleUploadMaterial = useCallback(async () => {
    try {
      // Validar que tenemos los datos necesarios
      if (!state.selectedSubject || !state.materialTitle) {
        dispatch({ type: 'SET_ERROR', payload: "Por favor completa todos los campos requeridos" });
        return;
      }
      
      if (state.activeTab === 'file' && (!state.files || state.files.length === 0)) {
        dispatch({ type: 'SET_ERROR', payload: "Por favor selecciona un archivo para analizar" });
        return;
      }
      
      if (state.activeTab === 'text' && !state.text.trim()) {
        dispatch({ type: 'SET_ERROR', payload: "Por favor ingresa texto para analizar" });
        return;
      }
      
      // Limpiar cualquier error previo
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // Actualizar estado de carga
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_PROCESSING_STEP', payload: "Subiendo material..." });
      
      // Subir el material
      const createdMaterial = await createMaterial(
        state.materialTitle,
        state.activeTab,
        state.selectedSubject,
        state.files,
        state.text
      );
      
      // Si se creó el material correctamente
      if (createdMaterial) {
        // Actualizar estado indicando que el material está subido
        dispatch({ type: 'SET_MATERIAL_UPLOADED', payload: true });
        dispatch({ type: 'SET_MATERIAL_ID', payload: createdMaterial.id });
        dispatch({ type: 'SHOW_SUCCESS', payload: true });
        dispatch({ type: 'SET_PROCESSING_STEP', payload: "Material subido correctamente" });
        
        // Ocultar mensaje de éxito después de un tiempo
        setTimeout(() => {
          dispatch({ type: 'SHOW_SUCCESS', payload: false });
        }, 3000);
      }
      
      // Actualizar estado de carga
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error("Error en la carga del material:", error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : "Error al subir el material" 
      });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state, createMaterial, dispatch]);
  
  // Manejar la generación de contenido
  const handleGenerateContent = useCallback(async () => {
    try {
      // Validar que el material esté subido
      if (!state.materialUploaded || !state.materialId) {
        dispatch({ type: 'SET_ERROR', payload: "Primero debes subir un material" });
        return;
      }
      
      // Limpiar cualquier error previo
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // Actualizar estado de carga
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_PROCESSING_STATUS', payload: 'pending' });
      dispatch({ type: 'SET_PROCESSING_STEP', payload: "Generando análisis del material..." });
      
      // Procesar el material para generar análisis
      const result = await processMaterial(
        state.materialId,
        state.generationMode
      );
      
      if (result) {
        // Crear un objeto AnalysisResult
        const analysisResult: AnalysisResult = {
          summary: result.summary || "Resumen en proceso de generación...",
          flashcards: Array.isArray(result.flashcards) ? result.flashcards.map(card => ({
            question: card.question || "Pregunta en generación...",
            answer: card.answer || "Respuesta en generación...",
            tags: card.tags || []
          })) : [{ 
            question: "Las flashcards se están generando...", 
            answer: "Pronto estarán disponibles para su revisión.",
            tags: []
          }]
        };
        
        // Actualizar el estado con los resultados
        dispatch({ type: 'SET_ANALYSIS_RESULT', payload: analysisResult });
        dispatch({ type: 'SHOW_SUCCESS', payload: true });
        dispatch({ type: 'SET_PROCESSING_STEP', payload: "Análisis completado correctamente" });
        
        // Ocultar mensaje de éxito después de un tiempo
        setTimeout(() => {
          dispatch({ type: 'SHOW_SUCCESS', payload: false });
          dispatch({ type: 'RESET_PROCESSING_STATE' });
        }, 3000);
      }
      
      // Actualizar estado de carga
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_PROCESSING_STATUS', payload: 'success' });
    } catch (error) {
      console.error("Error en la generación de contenido:", error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : "Error al generar contenido" 
      });
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_PROCESSING_STATUS', payload: 'error' });
    }
  }, [state.materialUploaded, state.materialId, state.generationMode, processMaterial, dispatch]);
  
  // Efecto para escuchar el evento para subir material
  useEffect(() => {
    const uploadMaterialHandler = () => {
      handleUploadMaterial();
    };
    
    document.addEventListener('uploadMaterial', uploadMaterialHandler);
    
    return () => {
      document.removeEventListener('uploadMaterial', uploadMaterialHandler);
    };
  }, [handleUploadMaterial]);
  
  // Efecto para escuchar el evento para generar contenido
  useEffect(() => {
    const generateContentHandler = () => {
      handleGenerateContent();
    };
    
    document.addEventListener('generateContent', generateContentHandler);
    
    return () => {
      document.removeEventListener('generateContent', generateContentHandler);
    };
  }, [handleGenerateContent]);
  
  // Para compatibilidad con el código anterior
  useEffect(() => {
    const startAnalysisHandler = () => {
      if (!state.materialUploaded) {
        handleUploadMaterial();
      } else {
        handleGenerateContent();
      }
    };
    
    document.addEventListener('startAnalysis', startAnalysisHandler);
    
    return () => {
      document.removeEventListener('startAnalysis', startAnalysisHandler);
    };
  }, [handleUploadMaterial, handleGenerateContent, state.materialUploaded]);
  
  // Actualizar el estado con información de carga
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
    dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: uploadProgress });
    dispatch({ type: 'SET_PROCESSING_STATUS', payload: processingStatus });
    dispatch({ type: 'SET_PROCESSING_STEP', payload: processingStep });
  }, [isLoading, uploadProgress, processingStatus, processingStep, dispatch]);
  
  return <UploadAreaContent />;
};

/**
 * Componente principal con el provider del contexto
 */
const UploadAreaPage: React.FC = () => {
  return (
    <StudyProvider>
      <StudyAreaController />
    </StudyProvider>
  );
};

export default UploadAreaPage;
