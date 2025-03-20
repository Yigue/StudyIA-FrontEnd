import { useState, useEffect } from 'react';
import { analyzeContent } from '../../../lib/openai';
import { Subject, AnalysisResult } from '../types/study.types';
import { 
  fetchSubjectsFromDB, 
  createNewSubjectInDB,
  saveMaterialAndFlashcardsInDB 
} from '../utils/study.utils';

export const useStudyArea = () => {
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

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await fetchSubjectsFromDB();
      setSubjects(data);
    } catch (error) {
      console.error('Error al obtener materias:', error);
      setError('No se pudieron cargar las materias. Por favor, recarga la página.');
    }
  };

  const handleCreateNewSubject = async () => {
    if (!newSubjectName.trim()) return;

    try {
      const newSubject = await createNewSubjectInDB(newSubjectName);
      setSubjects([...subjects, newSubject]);
      setSelectedSubject(newSubject.id);
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
          setText(prev => prev + '\n' + e.target!.result);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);

      selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setText(prev => prev + '\n' + e.target!.result);
          }
        };
        reader.readAsText(file);
      });
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
      await saveMaterialAndFlashcardsInDB(text, result, selectedSubject, files[0]?.name || 'Texto de estudio');
      setAnalysisResult(result);
      setSuccessMessage('Material y flashcards guardados exitosamente');
      setTimeout(() => {
        setSuccessMessage(null);
        setText('');
        setFiles([]);
        setAnalysisResult(null);
      }, 3000);
    } catch (error) {
      console.error('Error durante el análisis:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido durante el análisis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    state: {
      files,
      text,
      isAnalyzing,
      dragActive,
      subject: {
        subjects,
        selectedSubject,
        showNewSubjectInput,
        newSubjectName
      },
      fileUpload: {
        dragActive
      }
    },
    handlers: {
      setText,
      removeFile: (index: number) => setFiles(prev => prev.filter((_, i) => i !== index)),
      subject: {
        onSubjectSelect: setSelectedSubject,
        onNewSubjectNameChange: setNewSubjectName,
        onToggleNewSubject: () => setShowNewSubjectInput(!showNewSubjectInput),
        onCreateNewSubject: handleCreateNewSubject
      },
      fileUpload: {
        onDrag: handleDrag,
        onDrop: handleDrop,
        onFileSelect: handleFileSelect
      },
      handleAnalysis
    },
    error,
    successMessage,
    analysisResult
  };
};
