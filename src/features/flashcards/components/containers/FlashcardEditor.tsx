import React, { useState, useEffect } from 'react';
import { 
  Save,
  Image,
  Link,
  Bold,
  Italic,
  List,
  AlertCircle,
  X,
  ArrowLeft
} from 'lucide-react';
import { Flashcard, DifficultyLevel } from '../../../../types/flashcards/flashcards';

interface FlashcardEditorProps {
  onSave: (flashcard: Flashcard) => void;
  onCancel?: () => void;
  initialData?: Flashcard | null;
  materials?: Array<{ id: string; name: string }>;
  isSubmitting?: boolean;
}

const FlashcardEditor: React.FC<FlashcardEditorProps> = ({ 
  onSave, 
  onCancel, 
  initialData,
  materials = [],
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    question: initialData?.question || '',
    answer: initialData?.answer || '',
    difficulty: initialData?.difficulty?.toString() || 'normal',
    materialId: initialData?.materialId || initialData?.material_id || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Resetear el formulario cuando cambia initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        question: initialData.question || '',
        answer: initialData.answer || '',
        difficulty: initialData.difficulty?.toString() || 'normal',
        materialId: initialData.materialId || initialData.material_id || '',
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.question.trim()) {
      newErrors.question = 'La pregunta es obligatoria';
    }
    if (!formData.answer.trim()) {
      newErrors.answer = 'La respuesta es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const flashcardData: Partial<Flashcard> = {
        ...initialData,
        question: formData.question,
        answer: formData.answer,
        difficulty: formData.difficulty as DifficultyLevel,
        materialId: formData.materialId,
        // Estas propiedades se establecerán en el servidor
        archived: false,
        // Se añade el ID solo si estamos editando
        ...(initialData?.id ? { id: initialData.id } : {})
      };
      
      onSave(flashcardData as Flashcard);
    }
  };

  const toolbarButtons = [
    { icon: Bold, label: 'Negrita' },
    { icon: Italic, label: 'Cursiva' },
    { icon: List, label: 'Lista' },
    { icon: Image, label: 'Imagen' },
    { icon: Link, label: 'Enlace' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {initialData ? 'Editar Flashcard' : 'Crear Nueva Flashcard'}
          </h2>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-x-auto">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              title={button.label}
            >
              <button.icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          ))}
        </div>

        {/* Question */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pregunta
          </label>
          <textarea
            value={formData.question}
            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
            className={`w-full bg-white dark:bg-gray-700 border ${
              errors.question 
              ? 'border-red-300 dark:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'
            } rounded-md py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
            rows={3}
            placeholder="Escribe la pregunta..."
          />
          {errors.question && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.question}
            </p>
          )}
        </div>

        {/* Answer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Respuesta
          </label>
          <textarea
            value={formData.answer}
            onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
            className={`w-full bg-white dark:bg-gray-700 border ${
              errors.answer 
              ? 'border-red-300 dark:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'
            } rounded-md py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
            rows={5}
            placeholder="Escribe la respuesta..."
          />
          {errors.answer && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.answer}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Dificultad Inicial
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="easy">Fácil</option>
              <option value="normal">Normal</option>
              <option value="hard">Difícil</option>
              <option value="1">Muy Fácil (1)</option>
              <option value="2">Fácil (2)</option>
              <option value="3">Normal (3)</option>
              <option value="4">Difícil (4)</option>
              <option value="5">Muy Difícil (5)</option>
            </select>
          </div>
          
          {/* Material */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Material Relacionado
            </label>
            <select
              value={formData.materialId}
              onChange={(e) => setFormData(prev => ({ ...prev, materialId: e.target.value }))}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Sin material</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 border border-indigo-600 text-white rounded-md hover:bg-indigo-700 hover:border-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? 'Guardando...' : 'Guardar Flashcard'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlashcardEditor; 