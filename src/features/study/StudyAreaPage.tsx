import { useState, useEffect, useCallback, useMemo } from "react";
import { AlertCircle, Check, BookOpen, FileText, Upload, Sparkles, RefreshCw } from "lucide-react";

import SubjectSelectorComponent from "./components/SubjectSelector";
import FileUploaderComponent from './components/FileUploader';
import { TextEditor } from "./components/TextEditor";
import AIAssistantComponent from './components/AIAssistant';
import AnalysisResultsComponent from "./components/AnalysisResults";
import { useMaterials, useMaterialsActions, useMaterialsStatus } from "../../hook/useMaterials";
import { useTags, useTagsActions } from "../../hook/useTags";
import { useAuthStatus } from "../../hook/useAuth";
import { AnalysisResult, Subject } from "./types/study.types";
import { StudyMaterialDTO } from "../../types/studyMaterial/studyMaterialRequest";
import { Tag } from "../../types";

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

  // Hooks centralizados con memoización correcta
  const { generatingContent } = useMaterials();
  const { isLoading, uploadProgress } = useMaterialsStatus();
  const { uploadMaterial, uploadAndProcess, generateSummary, generateFlashcard, clearError } = useMaterialsActions();
  const { tags } = useTags();
  const { getAllTags, createTag } = useTagsActions();
  
  // Obtener el token solo una vez cuando se monta el componente
  const authStatus = useAuthStatus();
  const token = authStatus.token;

  // Cargar etiquetas/materias solo al montar el componente
  const loadTags = useCallback(async () => {
    if (token) {
      await getAllTags(token);
    }
  }, [getAllTags, token]);

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

    clearError();
    
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

      let createdMaterial = null;

      if (activeTab === 'file' && files.length > 0) {
        // Subir con archivo
        materialData.file = files[0]; // Por ahora solo procesamos el primer archivo
        createdMaterial = await uploadAndProcess(materialData);
      } else if (activeTab === 'text' && text.trim()) {
        // Subir con texto
        materialData.content = text;
        createdMaterial = await uploadMaterial(materialData);
      }

      // Si tenemos un material creado, generar resumen y/o flashcards según el modo seleccionado
      if (createdMaterial && createdMaterial.id) {
        // Generar contenido según el modo seleccionado
        const shouldGenerateSummary = generationMode === 'both' || generationMode === 'summary';
        const shouldGenerateFlashcards = generationMode === 'both' || generationMode === 'flashcards';

        if (shouldGenerateSummary) {
          await generateSummary(createdMaterial.id);
        }
        
        if (shouldGenerateFlashcards) {
          await generateFlashcard(createdMaterial.id);
        }
        
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
    }
  }, [formIsValid, selectedSubject, materialTitle, activeTab, files, text, generationMode, uploadAndProcess, uploadMaterial, generateSummary, generateFlashcard, clearError]);

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
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
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

            {/* Opciones de generación */}
            {/* <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué deseas generar?
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setGenerationMode('both')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    generationMode === 'both'
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Ambos
                </button>
                <button
                  type="button"
                  onClick={() => setGenerationMode('summary')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    generationMode === 'summary'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Solo resumen
                </button>
                <button
                  type="button"
                  onClick={() => setGenerationMode('flashcards')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    generationMode === 'flashcards'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Solo flashcards
                </button>
              </div>
            </div> */}

            {/* Barra de progreso para carga */}
            {isLoading && uploadProgress > 0 && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Subiendo material...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAnalysis}
                disabled={!formIsValid || isLoading || generatingContent}
                className={`px-5 py-3 rounded-lg font-medium flex items-center gap-2 ${
                  !formIsValid || isLoading || generatingContent
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isLoading || generatingContent ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Procesando...
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
                disabled={isLoading || generatingContent}
                className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Limpiar todo
              </button>
            </div>
          </div>

          {/* Consejos */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800 mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Consejos para obtener mejores resultados
            </h3>
            <ul className="text-blue-700 space-y-2 list-disc pl-5">
              <li>Asegúrate de que el texto sea claro y esté bien estructurado</li>
              <li>Para archivos PDF, verifica que el texto sea seleccionable (no imágenes)</li>
              <li>Proporciona un título descriptivo para mejorar la calidad de los resúmenes</li>
              <li>Los mejores resultados se obtienen con documentos de 1-10 páginas</li>
            </ul>
          </div>
        </div>

        {/* Panel derecho - Resultados */}
        <div className="lg:col-span-5 space-y-6">
          <AIAssistantComponent
            isAnalyzing={isLoading || generatingContent}
            isDisabled={!formIsValid}
            onAnalyze={handleAnalysis}
            generationMode={generationMode}
            setGenerationMode={setGenerationMode}
          />

          {/* Resultados del análisis */}
          {analysisResult && (
            <AnalysisResultsComponent result={analysisResult} />
          )}

          {/* Mensaje cuando no hay resultados */}
          {!analysisResult && !isLoading && !generatingContent && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-indigo-50 rounded-full">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Aún no hay resultados</h3>
              <p className="text-gray-600 mb-4">
                Rellena el formulario y haz clic en "Generar con IA" para obtener resúmenes y flashcards
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyAreaPage;
