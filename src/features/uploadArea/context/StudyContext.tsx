import React, { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';
import { AnalysisResult, Subject } from '../../../types/study';

// Tipos para el estado y las acciones
export type StudyMaterialType = 'file' | 'text';
export type GenerationMode = 'both' | 'summary' | 'flashcards';

interface StudyState {
  // Estado de entrada
  files: File[];
  text: string;
  activeTab: StudyMaterialType;
  materialTitle: string;
  selectedSubject: Subject | null;
  
  // Estado de generación
  generationMode: GenerationMode;
  analysisResult: AnalysisResult | null;
  
  // Estado del material
  materialUploaded: boolean;
  materialId: string | null;
  
  // Estado de UI
  isLoading: boolean;
  uploadProgress: number;
  processingStatus: 'idle' | 'pending' | 'success' | 'error';
  processingStep: string;
  showSuccess: boolean;
  error: string | null;
}

type StudyAction =
  | { type: 'SET_FILES'; payload: File[] }
  | { type: 'SET_TEXT'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: StudyMaterialType }
  | { type: 'SET_MATERIAL_TITLE'; payload: string }
  | { type: 'SET_SELECTED_SUBJECT'; payload: Subject | null }
  | { type: 'SET_GENERATION_MODE'; payload: GenerationMode }
  | { type: 'SET_ANALYSIS_RESULT'; payload: AnalysisResult | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_UPLOAD_PROGRESS'; payload: number }
  | { type: 'SET_PROCESSING_STATUS'; payload: 'idle' | 'pending' | 'success' | 'error' }
  | { type: 'SET_PROCESSING_STEP'; payload: string }
  | { type: 'SHOW_SUCCESS'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MATERIAL_UPLOADED'; payload: boolean }
  | { type: 'SET_MATERIAL_ID'; payload: string | null }
  | { type: 'RESET_FORM' }
  | { type: 'RESET_PROCESSING_STATE' }
  | { type: 'RESET_MATERIAL_STATE' };

// Estado inicial
const initialState: StudyState = {
  files: [],
  text: '',
  activeTab: 'file',
  materialTitle: '',
  selectedSubject: null,
  generationMode: 'both',
  analysisResult: null,
  materialUploaded: false,
  materialId: null,
  isLoading: false,
  uploadProgress: 0,
  processingStatus: 'idle',
  processingStep: '',
  showSuccess: false,
  error: null,
};

// Reducer para manejar las acciones
const studyReducer = (state: StudyState, action: StudyAction): StudyState => {
  switch (action.type) {
    case 'SET_FILES':
      return { ...state, files: action.payload };
    case 'SET_TEXT':
      return { ...state, text: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_MATERIAL_TITLE':
      return { ...state, materialTitle: action.payload };
    case 'SET_SELECTED_SUBJECT':
      return { ...state, selectedSubject: action.payload };
    case 'SET_GENERATION_MODE':
      return { ...state, generationMode: action.payload };
    case 'SET_ANALYSIS_RESULT':
      return { ...state, analysisResult: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_UPLOAD_PROGRESS':
      return { ...state, uploadProgress: action.payload };
    case 'SET_PROCESSING_STATUS':
      return { ...state, processingStatus: action.payload };
    case 'SET_PROCESSING_STEP':
      return { ...state, processingStep: action.payload };
    case 'SHOW_SUCCESS':
      return { ...state, showSuccess: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_MATERIAL_UPLOADED':
      return { ...state, materialUploaded: action.payload };
    case 'SET_MATERIAL_ID':
      return { ...state, materialId: action.payload };
    case 'RESET_FORM':
      return {
        ...state,
        files: [],
        text: '',
        materialTitle: '',
        selectedSubject: null,
        error: null,
      };
    case 'RESET_PROCESSING_STATE':
      return {
        ...state,
        isLoading: false,
        uploadProgress: 0,
        processingStatus: 'idle',
        processingStep: '',
        error: null
      };
    case 'RESET_MATERIAL_STATE':
      return {
        ...state,
        materialUploaded: false,
        materialId: null,
        analysisResult: null,
      };
    default:
      return state;
  }
};

// Contexto
interface StudyContextType {
  state: StudyState;
  dispatch: React.Dispatch<StudyAction>;
  
  // Valores derivados
  formIsValid: boolean;
  isGenerating: boolean;
  canGenerateContent: boolean;
}

const StudyContext = createContext<StudyContextType | null>(null);

// Hook personalizado para acceder al contexto
export const useStudyContext = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudyContext debe ser usado dentro de un StudyProvider');
  }
  return context;
};

// Proveedor del contexto
interface StudyProviderProps {
  children: ReactNode;
}

export const StudyProvider: React.FC<StudyProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(studyReducer, initialState);
  
  // Valores derivados
  const formIsValid = useMemo(() => {
    return (
      state.selectedSubject !== null &&
      state.materialTitle.trim() !== '' &&
      (state.activeTab === 'file' ? state.files.length > 0 : state.text.trim() !== '')
    );
  }, [state.selectedSubject, state.materialTitle, state.activeTab, state.files, state.text]);
  
  const isGenerating = state.processingStatus === 'pending';
  
  // Determinar si se puede generar contenido (solo si el material ya está subido)
  const canGenerateContent = useMemo(() => {
    return state.materialUploaded && !state.isLoading && state.materialId !== null;
  }, [state.materialUploaded, state.isLoading, state.materialId]);
  
  const value = {
    state,
    dispatch,
    formIsValid,
    isGenerating,
    canGenerateContent,
  };
  
  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}; 