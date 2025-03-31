import React, { useState } from 'react';
import { 
  Save,
  Image,
  Link,
  Bold,
  Italic,
  List,
  AlertCircle
} from 'lucide-react';
import { Flashcard } from '../../../types';

interface FlashcardEditorProps {
  onSave: (flashcard: Flashcard) => void;
  onCancel?: () => void;
  initialData?: Flashcard | null;
}

const FlashcardEditor: React.FC<FlashcardEditorProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    question: initialData?.question || '',
    answer: initialData?.answer || '',
    difficulty: initialData?.difficulty || 'normal',
    material_id: initialData?.material_id || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
        ...formData,
        // Estas propiedades se establecerán en el servidor
        active: true,
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
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        {initialData ? 'Editar Flashcard' : 'Crear Nueva Flashcard'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title={button.label}
            >
              <button.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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
            className={`input-base w-full ${
              errors.question ? 'border-red-300 dark:border-red-500' : ''
            }`}
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
            className={`input-base w-full ${
              errors.answer ? 'border-red-300 dark:border-red-500' : ''
            }`}
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

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Dificultad Inicial
          </label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
            className="input-base w-full"
          >
            <option value="easy">Fácil</option>
            <option value="normal">Normal</option>
            <option value="hard">Difícil</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Guardar Flashcard
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlashcardEditor;