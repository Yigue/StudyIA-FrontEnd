import React from 'react';
import { Upload, FileText, RefreshCw, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useStudyContext } from '../context/StudyContext';
import SubjectSelectorComponent from './SubjectSelector';
import FileUploaderComponent from './FileUploader';
import { TextEditor } from './TextEditor';
import { Subject } from '../../../types/study';
import { Tag } from '../../../types';

interface StudyInputPanelProps {
  subjects: Subject[];
}

/**
 * Componente que maneja la entrada de datos para el estudio
 */
const StudyInputPanel: React.FC<StudyInputPanelProps> = ({ subjects }) => {
  const { state, dispatch, formIsValid } = useStudyContext();
  
  // Destructuring del estado
  const { 
    activeTab, 
    files, 
    text, 
    materialTitle, 
    selectedSubject, 
    isLoading, 
    uploadProgress,
    processingStatus,
    processingStep,
    error
  } = state;

  // Handlers para los cambios de estado
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_MATERIAL_TITLE', payload: e.target.value });
  };

  const handleTabChange = (tab: 'file' | 'text') => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  };

  const handleFilesChange = (newFiles: File[]) => {
    dispatch({ type: 'SET_FILES', payload: newFiles });
  };

  const handleTextChange = (newText: string) => {
    dispatch({ type: 'SET_TEXT', payload: newText });
  };

  const handleSubjectSelect = (subject: Tag | null) => {
    // Convertir Tag a Subject para el estado si es necesario
    if (subject) {
      const subjectData: Subject = {
        id: subject.id,
        name: subject.name
      };
      dispatch({ type: 'SET_SELECTED_SUBJECT', payload: subjectData });
    } else {
      dispatch({ type: 'SET_SELECTED_SUBJECT', payload: null });
    }
  };

  const handleAnalysis = () => {
    // El procesamiento real se maneja en el componente padre
    if (formIsValid) {
      // Emitir un evento personalizado para que el componente padre lo capture
      const event = new CustomEvent('uploadMaterial');
      document.dispatchEvent(event);
    }
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  // Renderizar estado de procesamiento
  const renderProcessingStatus = () => {
    if (!isLoading && processingStatus === 'idle') return null;
    
    let statusMessage = processingStep || 'Procesando...';
    let icon = <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />;
    let statusClass = "bg-indigo-50 border-indigo-200 text-indigo-700";
    
    if (processingStatus === 'success') {
      icon = <CheckCircle className="w-5 h-5 text-green-500" />;
      statusClass = "bg-green-50 border-green-200 text-green-700";
    } else if (processingStatus === 'error') {
      icon = <AlertCircle className="w-5 h-5 text-red-500" />;
      statusClass = "bg-red-50 border-red-200 text-red-700";
    } else if (uploadProgress > 0 && uploadProgress < 100) {
      statusMessage = `Subiendo material (${uploadProgress}%)`;
    }
    
    return (
      <div className={`mb-6 p-4 rounded-lg border ${statusClass} flex items-center gap-3`}>
        {icon}
        <span className="text-sm font-medium">{statusMessage}</span>
      </div>
    );
  };

  // Renderizar mensaje de error
  const renderError = () => {
    if (!error) return null;
    
    return (
      <div className="mb-6 p-4 rounded-lg border bg-red-50 border-red-200 text-red-700 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <span className="text-sm font-medium">{error}</span>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Material de Estudio</h2>
      
      {/* Mensajes de estado y error */}
      {renderProcessingStatus()}
      {renderError()}

      {/* Título del material */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
          Título del Material
        </label>
        <input
          type="text"
          value={materialTitle}
          onChange={handleTitleChange}
          placeholder="Ingresa un título para tu material de estudio"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          disabled={isLoading}
        />
      </div>

      {/* Selector de materia */}
      <div className="mb-6">
        <SubjectSelectorComponent 
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSubjectSelect={handleSubjectSelect}
        />
      </div>

      {/* Pestañas para elegir modo de entrada */}
      <div className="mb-4">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`py-3 px-4 font-medium ${
              activeTab === 'file' 
                ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => handleTabChange('file')}
            disabled={isLoading}
          >
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Archivos
            </div>
          </button>
          <button
            className={`py-3 px-4 font-medium ${
              activeTab === 'text' 
                ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => handleTabChange('text')}
            disabled={isLoading}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Texto
            </div>
          </button>
        </div>
      </div>

      {/* Contenido según la pestaña activa */}
      <div className="mb-6">
        {activeTab === 'file' ? (
          <div className="space-y-4">
            <FileUploaderComponent 
              files={files}
              onFilesChange={handleFilesChange}
              isUploading={isLoading && uploadProgress > 0}
              uploadProgress={uploadProgress}
              disabled={isLoading}
            />
          </div>
        ) : (
          <TextEditor 
            value={text} 
            onChange={handleTextChange}
          />
        )}
      </div>

      {/* Guía de uso */}
      <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-800 rounded-lg border border-blue-100 dark:border-blue-700 flex items-start gap-3 text-sm text-blue-700 dark:text-blue-400">
        <Info className="w-5 h-5 text-blue-500 mt-0.5" />
        <div>
          <p className="font-medium mb-1">Consejos para un mejor análisis:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Asegúrate de que el título sea descriptivo</li>
            <li>Usa documentos PDF de buena calidad sin protección</li>
            <li>Si usas texto, estructura bien tu contenido</li>
          </ul>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3">
        <button
          onClick={handleAnalysis}
          disabled={!formIsValid || isLoading}
          className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
            !formIsValid || isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Procesando...
            </>
          ) : state.materialUploaded ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Material Subido
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Subir Material
            </>
          )}
        </button>
        
        <button
          onClick={handleReset}
          disabled={isLoading}
          className="py-3 px-4 rounded-lg font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default StudyInputPanel; 