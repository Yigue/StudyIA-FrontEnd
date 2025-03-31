import { useState, useEffect, useCallback, useMemo } from "react";
import { AlertCircle, Check, FileText, Upload, Sparkles, RefreshCw, PencilLine, BookOpen, Loader2 } from "lucide-react";

import SubjectSelectorComponent from "./components/SubjectSelector";
import FileUploaderComponent from './components/FileUploader';
import { TextEditor } from "./components/TextEditor";
import AIAssistant from './components/AIAssistant';
import AnalysisResultsComponent from "./components/AnalysisResults";
import { useMaterials } from "../../hooks/useMaterials";
import { useTags } from "../../hooks/useTags";
import { AnalysisResult, Subject } from "./types/study.types";
import { Tag } from "../../types";

// Tipo para los datos del material de estudio
interface StudyMaterialDTO {
  title: string;
  summary: string;
  type: string;
  tags: Tag[];
  file?: File;
  content?: string;
}

// Nuevo componente para controles de IA
const AIControls: React.FC<{
  mode: 'both' | 'summary' | 'flashcards';
  setMode: (mode: 'both' | 'summary' | 'flashcards') => void;
  onGenerateContent: () => void;
  generatingContent: boolean;
  isFormValid: boolean;
  progress: number;
  isLoading: boolean;
}> = ({ mode, setMode, onGenerateContent, generatingContent, isFormValid, progress, isLoading }) => {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Asistente de IA
            </h3>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          Deja que nuestra IA analice tu contenido y genere automáticamente resúmenes y flashcards para ayudarte a estudiar.
        </p>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              ¿Qué quieres generar?
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode('both')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                mode === 'both'
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-700/10 dark:ring-indigo-500/20'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              } inline-flex items-center gap-2`}
              disabled={generatingContent}
            >
              <Sparkles className="w-4 h-4" />
              <span>Ambos</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('summary')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                mode === 'summary'
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-700/10 dark:ring-indigo-500/20'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              } inline-flex items-center gap-2`}
              disabled={generatingContent}
            >
              <PencilLine className="w-4 h-4" />
              <span>Solo Resumen</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('flashcards')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                mode === 'flashcards'
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-700/10 dark:ring-indigo-500/20'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              } inline-flex items-center gap-2`}
              disabled={generatingContent}
            >
              <BookOpen className="w-4 h-4" />
              <span>Solo Flashcards</span>
            </button>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={onGenerateContent}
            disabled={isLoading || generatingContent || !isFormValid}
            className={`w-full py-2.5 px-4 rounded-md font-medium flex items-center justify-center gap-2 ${
              isFormValid
                ? 'bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            } transition-colors duration-150`}
          >
            {generatingContent ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generando contenido ({Math.round(progress)}%)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generar con IA</span>
              </>
            )}
          </button>
        </div>

        {!isFormValid && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
            Por favor, completa todos los campos requeridos (título, material y materia) antes de generar el contenido.
          </p>
        )}
      </div>

      {/* Barra de progreso para la generación */}
      {generatingContent && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
          <div 
            className="h-1 bg-indigo-600 dark:bg-indigo-500 transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

const StudyAreaPage: React.FC = () => {
  // Estado de la página
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"file" | "text">("file");
  const [materialTitle, setMaterialTitle] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<Tag | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [generationMode, setGenerationMode] = useState<"both" | "summary" | "flashcards">("both");
  
  // Estado para mensajes y errores
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Hooks centralizados modernizados
  const { 
    createMaterial, 
    processMaterial, 
    clearError: clearMaterialsError,
    loading,
  } = useMaterials();
  
  const { tags } = useTags();
  
  // Obtener valores derivados del estado
  const isLoading = loading.isLoading;
  const uploadProgress = loading.uploadProgress;
  const generatingContent = loading.processingStatus === "pending";

  // Cargar etiquetas al montar el componente
  const loadTags = useCallback(async () => {
    if (tags.length === 0 && typeof tags.getAllTags === 'function') {
      await tags.getAllTags();
    }
  }, [tags]);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  // Convertir tags a Subject para el selector
  const subjects: Subject[] = useMemo(() => {
    return tags.map((tag: Tag) => ({
      id: tag.id,
      name: tag.name
    }));
  }, [tags]);

  // Validación del formulario
  const formIsValid = useMemo(() => {
    return (
      selectedSubject !== null &&
      materialTitle.trim() !== "" &&
      (activeTab === 'file' ? files.length > 0 : text.trim() !== "")
    );
  }, [selectedSubject, materialTitle, activeTab, files, text]);

  // Manejar análisis y generación de contenido
  const handleAnalysis = useCallback(async () => {
    if (!formIsValid) {
      return;
    }

    clearMaterialsError();
    
    try {
      // Crear material según el tipo de contenido (texto o archivo)
      const materialData: StudyMaterialDTO = {
        title: materialTitle,
        summary: "",
        type: activeTab === 'file' ? "file" : "text",
        tags: [{ 
          id: selectedSubject?.id || "", 
          name: selectedSubject?.name || "",
          color: "",
          user_id: "",
          created_at: new Date(),
          count: 0
        }]
      };

      // Opciones de procesamiento
      const processingOptions = {
        generate_summary: generationMode === 'both' || generationMode === 'summary',
        generate_flashcards: generationMode === 'both' || generationMode === 'flashcards',
        summary_options: {},
        flashcards_options: {}
      };

      let createdMaterial = null;

      if (activeTab === 'file' && files.length > 0) {
        // Subir con archivo
        materialData.file = files[0]; // Por ahora solo procesamos el primer archivo
        
        // Crear y procesar material en un solo paso
        createdMaterial = await createMaterial(materialData, { type: "file" });
        
        if (createdMaterial) {
          await processMaterial(createdMaterial, processingOptions);
        }
      } else if (activeTab === 'text' && text.trim()) {
        // Subir con texto
        materialData.content = text;
        
        // Crear y procesar material en un solo paso
        createdMaterial = await createMaterial(materialData, { type: "text" });
        
        if (createdMaterial) {
          await processMaterial(createdMaterial, processingOptions);
        }
      }

      // Si se ha creado un material correctamente
      if (createdMaterial) {
        // Mostrar mensaje de éxito
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);

        // Crear el objeto de resultados del análisis
        setAnalysisResult({
          summary: createdMaterial.summary || "Resumen en proceso de generación...",
          flashcards: [
            { question: "Las flashcards se están generando...", answer: "Pronto estarán disponibles para su revisión." }
          ]
        });

        // Limpiar los campos después de un procesamiento exitoso
        setFiles([]);
        setText("");
        setMaterialTitle("");
      }
    } catch (error) {
      console.error("Error en el procesamiento:", error);
      setError(error instanceof Error ? error.message : "Error desconocido en el procesamiento");
    }
  }, [formIsValid, selectedSubject, materialTitle, activeTab, files, text, generationMode, createMaterial, processMaterial, clearMaterialsError]);

  // Reiniciar el formulario
  const handleReset = () => {
    setFiles([]);
    setText("");
    setMaterialTitle("");
    setSelectedSubject(null);
    setAnalysisResult(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Área de Estudio
      </h1>

      {/* Notificaciones de error y éxito */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 animate-fadeIn">
          <AlertCircle className="min-w-5 w-5 h-5 text-red-600" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fadeIn">
          <Check className="min-w-5 w-5 h-5 text-green-600" />
          <p className="text-green-600">¡Material procesado correctamente! Los resultados se mostrarán a continuación.</p>
        </div>
      )}

      {/* Contenedor principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel izquierdo - Entrada de datos */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            {/* Título del material */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título del Material
              </label>
              <input
                type="text"
                value={materialTitle}
                onChange={(e) => setMaterialTitle(e.target.value)}
                placeholder="Ingresa un título para tu material de estudio"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Selector de materia */}
            <div className="mb-6">
              <SubjectSelectorComponent 
                subjects={subjects}
                selectedSubject={selectedSubject}
                onSubjectSelect={setSelectedSubject}
              />
            </div>

            {/* Pestañas para elegir modo de entrada */}
            <div className="mb-4">
              <div className="flex border-b border-gray-200">
                <button
                  className={`py-3 px-4 font-medium ${
                    activeTab === 'file' 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('file')}
                >
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Archivos
                  </div>
                </button>
                <button
                  className={`py-3 px-4 font-medium ${
                    activeTab === 'text' 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('text')}
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
                    onFilesChange={setFiles}
                  />
                </div>
              ) : (
                <TextEditor 
                  value={text} 
                  onChange={setText} 
                />
              )}
            </div>

            {/* Barra de progreso para carga */}
            {isLoading && uploadProgress > 0 && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-1 dark:text-white ">
                  <span>Subiendo material...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                onClick={handleAnalysis}
                disabled={!formIsValid || isLoading}
                className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
                  !formIsValid || isLoading
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analizar Material
                  </>
                )}
              </button>
              
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="py-3 px-4 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Componentes de IA */}
          <div className="grid grid-cols-1 gap-6">
            <AIControls
              mode={generationMode}
              setMode={setGenerationMode}
              onGenerateContent={handleAnalysis}
              generatingContent={generatingContent}
              isFormValid={formIsValid}
              progress={uploadProgress}
              isLoading={isLoading}
            />
            <AIAssistant />
          </div>
        </div>

        {/* Panel derecho - Resultados del análisis */}
        <div className="lg:col-span-5">
          <AnalysisResultsComponent 
            analysisResult={analysisResult}
            isGenerating={generatingContent}
          />
        </div>
      </div>
    </div>
  );
};

export default StudyAreaPage;
