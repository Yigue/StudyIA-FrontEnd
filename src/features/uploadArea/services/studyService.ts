import { StudyMaterialType, GenerationMode } from '../context/StudyContext';
import { Subject, ProcessingOptions, StudyMaterial, CreateMaterialDTO, MaterialType } from '../../../types/study';
import { useMaterials } from '../../../hooks/useMaterials';
import { useState, useCallback } from 'react';

/**
 * Prepara las opciones de procesamiento según el modo seleccionado
 */
export const prepareProcessingOptions = (mode: GenerationMode): ProcessingOptions => {
  const options: ProcessingOptions = {
    generate_summary: mode === 'both' || mode === 'summary',
    generate_flashcards: mode === 'both' || mode === 'flashcards',
    flashcards_options: {
      difficulty: 'medium',
      count: 10
    }
  };

  // Solo añadir opciones de resumen si se va a generar
  if (options.generate_summary) {
    options.summary_options = {
      focus: 'key_points'
    };
  }

  return options;
};

/**
 * Convierte StudyMaterialType a MaterialType
 */
const convertMaterialType = (type: StudyMaterialType): MaterialType => {
  if (type === 'file') return MaterialType.FILE;
  if (type === 'text') return MaterialType.TEXT;
  return MaterialType.FILE; // Default
};

/**
 * Prepara los datos del material de estudio para enviar al servidor
 */
export const prepareStudyMaterialDTO = (
  title: string,
  type: StudyMaterialType,
  subject: Subject | null,
  files: File[],
  text: string
): CreateMaterialDTO => {
  const materialData: CreateMaterialDTO = {
    title,
    summary: "",
    type: convertMaterialType(type),
    tags: subject ? [{ 
      id: subject.id, 
      name: subject.name,
      color: "",
      createdAt: new Date(),
      count: 0
    }] : []
  };

  if (type === 'file' && files.length > 0) {
    materialData.file = files[0];
  } else if (type === 'text' && text.trim()) {
    materialData.content = text;
  }

  return materialData;
};

/**
 * Hook que encapsula la lógica para crear y procesar materiales de estudio
 */
export const useStudyMaterialProcessing = () => {
  const { 
    createMaterial: apiCreateMaterial, 
    processMaterial: apiProcessMaterial, 
    clearError: clearMaterialsError
  } = useMaterials();
  
  // Estado local para manejo de carga detallado
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [processingStep, setProcessingStep] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Crea un material de estudio
   */
  const createMaterial = async (
    title: string,
    type: StudyMaterialType,
    subject: Subject | null,
    files: File[],
    text: string
  ): Promise<StudyMaterial | null> => {
    // Preparar datos
    const materialData = prepareStudyMaterialDTO(title, type, subject, files, text);
    
    try {
      clearMaterialsError();
      setIsLoading(true);
      setProcessingStep('Preparando material...');
      
      // Actualizar progreso y estado mediante callbacks
      const uploadOptions = {
        type: type === 'file' ? 'file' : 'text',
        onUploadProgress: (progress: number) => {
          setUploadProgress(progress);
          setProcessingStep(`Subiendo material (${progress}%)...`);
        },
        onProcessingStatusChange: (status: 'idle' | 'pending' | 'success' | 'error') => {
          setProcessingStatus(status);
          
          if (status === 'pending') {
            setProcessingStep('Procesando material en el servidor...');
          } else if (status === 'success') {
            setProcessingStep('Material creado exitosamente');
          } else if (status === 'error') {
            setProcessingStep('Error procesando el material');
          }
        }
      };
      
      // Crear material en el servidor - Forzamos el tipo correcto
      const createdMaterial = await apiCreateMaterial(
        materialData as any, 
        uploadOptions
      );

      setIsLoading(false);
      return createdMaterial;
    } catch (error) {
      console.error('Error al crear material:', error);
      setProcessingStatus('error');
      setProcessingStep('Error creando el material');
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * Procesa un material para generar resumen y flashcards
   */
  const processMaterial = async (
    materialId: string,
    generationMode: GenerationMode
  ): Promise<{ summary: string; flashcards: Record<string, any>[] } | null> => {
    try {
      clearMaterialsError();
      setIsLoading(true);
      setProcessingStatus('pending');
      setProcessingStep('Generando análisis...');
      
      // Preparar opciones de procesamiento
      const processingOptions = prepareProcessingOptions(generationMode);
      
      // Procesar el material creado para generar resumen y/o flashcards
      const result = await apiProcessMaterial(
        { id: materialId } as { id: string }, // Simplificamos el tipo
        processingOptions
      );
      
      // Actualizar estado final
      setProcessingStep('Análisis completado');
      setProcessingStatus('success');
      setIsLoading(false);
      
      // Convertir a formato esperado
      return {
        summary: typeof result?.summary === 'object' ? (result?.summary?.content || '') : (result?.summary || ''),
        flashcards: Array.isArray(result?.flashcards) ? result.flashcards.map(card => ({
          question: card.question || '',
          answer: card.answer || '',
          tags: card.tags || []
        })) : []
      };
    } catch (error) {
      console.error('Error al procesar material:', error);
      setProcessingStatus('error');
      setProcessingStep('Error en el análisis');
      setIsLoading(false);
      throw error;
    }
  };
  
  /**
   * Proceso completo (para compatibilidad con código anterior)
   */
  const processStudyMaterial = async (
    title: string,
    type: StudyMaterialType,
    subject: Subject | null,
    files: File[],
    text: string,
    mode: GenerationMode
  ): Promise<StudyMaterial | null> => {
    try {
      // Primero crear el material
      const createdMaterial = await createMaterial(
        title,
        type,
        subject,
        files,
        text
      );
      
      if (createdMaterial && createdMaterial.id) {
        // Luego procesarlo
        await processMaterial(createdMaterial.id, mode);
      }
      
      return createdMaterial;
    } catch (error) {
      console.error('Error en el proceso completo:', error);
      throw error;
    }
  };
  
  // Reiniciar estado de carga
  const resetProcessingState = useCallback(() => {
    setUploadProgress(0);
    setProcessingStatus('idle');
    setProcessingStep('');
    setIsLoading(false);
  }, []);
  
  // Retornar la función y el estado de carga
  return { 
    createMaterial,
    processMaterial,
    processStudyMaterial,
    resetProcessingState,
    isLoading,
    uploadProgress,
    processingStatus,
    processingStep
  };
}; 