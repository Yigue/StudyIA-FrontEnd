import React, { useState, useRef, useEffect } from 'react';
import { FileUp, Book, Brain, X, Upload, Loader2, BookOpen, LayoutGrid, Type, FolderPlus, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { analyzeContent } from '../lib/openai';

interface Subject {
  id: string;
  name: string;
}

interface AnalysisResult {
  summary: string;
  flashcards: Array<{
    question: string;
    answer: string;
  }>;
}

const StudyArea = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [showNewSubjectInput, setShowNewSubjectInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data, error: supabaseError } = await supabase
        .from('subjects')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name');
      
      if (supabaseError) throw supabaseError;

      setSubjects(data || []);
    } catch (error) {
      console.error('Error al obtener materias:', error);
      setError('No se pudieron cargar las materias. Por favor, recarga la página.');
    }
  };

  const createNewSubject = async () => {
    if (!newSubjectName.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data, error: supabaseError } = await supabase
        .from('subjects')
        .insert([{ 
          name: newSubjectName,
          user_id: user.id 
        }])
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      setSubjects([...subjects, data]);
      setSelectedSubject(data.id);
      setNewSubjectName('');
      setShowNewSubjectInput(false);
      setError(null);
      setSuccessMessage('Materia creada exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error al crear materia:', error);
      setError('No se pudo crear la materia. Por favor, intenta nuevamente.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);

    for (const file of droppedFiles) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setText(prev => prev + '\n' + e.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);

      selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setText(prev => prev + '\n' + e.target.result);
          }
        };
        reader.readAsText(file);
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const saveMaterialAndFlashcards = async (result: AnalysisResult) => {
    try {
      if (!selectedSubject) {
        throw new Error('Por favor, selecciona o crea una materia primero');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data: material, error: materialError } = await supabase
        .from('study_materials')
        .insert([{
          title: files[0]?.name || 'Texto de estudio',
          content: text,
          summary: result.summary,
          subject_id: selectedSubject,
          user_id: user.id
        }])
        .select()
        .single();

      if (materialError) throw materialError;

      const flashcardsData = result.flashcards.map(fc => ({
        question: fc.question,
        answer: fc.answer,
        material_id: material.id,
        user_id: user.id,
        difficulty: 3,
        next_review: new Date().toISOString()
      }));

      const { error: flashcardsError } = await supabase
        .from('flashcards')
        .insert(flashcardsData);

      if (flashcardsError) throw flashcardsError;

      setError(null);
      setSuccessMessage('Material y flashcards guardados exitosamente');
      setTimeout(() => {
        setSuccessMessage(null);
        setText('');
        setFiles([]);
        setAnalysisResult(null);
      }, 3000);
      return true;
    } catch (error) {
      console.error('Error al guardar el material:', error);
      throw new Error('No se pudo guardar el material. Por favor, intenta nuevamente.');
    }
  };

  const handleAnalysis = async () => {
    if (!text.trim()) {
      setError('Por favor, ingresa algún texto para analizar');
      return;
    }

    if (!selectedSubject) {
      setError('Por favor, selecciona o crea una materia primero');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      const result = await analyzeContent(text);
      await saveMaterialAndFlashcards(result);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error durante el análisis:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido durante el análisis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Área de Estudio</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-600">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Seleccionar Materia</h3>
              <button
                onClick={() => setShowNewSubjectInput(!showNewSubjectInput)}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
              >
                <FolderPlus className="w-5 h-5" />
                Nueva Materia
              </button>
            </div>

            {showNewSubjectInput ? (
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="Nombre de la materia"
                  className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={createNewSubject}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Agregar
                </button>
              </div>
            ) : (
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Selecciona una materia</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px] transition-colors ${
              dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FileUp className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 text-center mb-2">
              Arrastra y suelta tus documentos aquí
            </p>
            <p className="text-sm text-gray-500 text-center mb-4">
              o haz clic para seleccionar archivos
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInput}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Subir Archivos
            </button>
          </div>

          {files.length > 0 && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-medium text-gray-800 mb-3">Archivos seleccionados:</h4>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Type className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">O pega tu texto</h3>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Pega o escribe tu texto aquí..."
              className="w-full h-40 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Brain className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Asistente IA</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Sube documentos o pega texto, y la IA te ayudará a crear resúmenes y flashcards personalizadas.
            </p>
            <button 
              onClick={handleAnalysis}
              disabled={!text.trim() || !selectedSubject || isAnalyzing}
              className={`w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                !text.trim() || !selectedSubject
                  ? 'bg-gray-300 cursor-not-allowed'
                  : isAnalyzing
                  ? 'bg-indigo-500 cursor-wait'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analizando...
                </>
              ) : (
                'Iniciar Análisis'
              )}
            </button>
          </div>

          {analysisResult && (
            <>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Resumen</h3>
                </div>
                <p className="text-gray-600 whitespace-pre-line">
                  {analysisResult.summary}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <LayoutGrid className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Flashcards</h3>
                </div>
                <div className="space-y-4">
                  {analysisResult.flashcards.map((flashcard, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800 mb-2">P: {flashcard.question}</p>
                      <p className="text-gray-600">R: {flashcard.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyArea;