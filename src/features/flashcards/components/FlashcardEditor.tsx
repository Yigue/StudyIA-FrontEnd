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
import { useStudyStore } from '../lib/store';

interface FlashcardEditorProps {
  onSave: (flashcard: any) => void;
  initialData?: any;
}

const FlashcardEditor: React.FC<FlashcardEditorProps> = ({ onSave, initialData }) => {
  const [formData, setFormData] = useState({
    question: initialData?.question || '',
    answer: initialData?.answer || '',
    tags: initialData?.tags || [],
    difficulty: initialData?.difficulty || 3,
    subject: initialData?.subject || '',
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
    if (!formData.subject) {
      newErrors.subject = 'Selecciona una materia';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        ...formData,
        created_at: new Date().toISOString(),
        next_review: new Date().toISOString(),
      });
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {initialData ? 'Editar Flashcard' : 'Crear Nueva Flashcard'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              className="p-2 hover:bg-gray-200 rounded"
              title={button.label}
            >
              <button.icon className="w-5 h-5 text-gray-600" />
            </button>
          ))}
        </div>

        {/* Question */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pregunta
          </label>
          <textarea
            value={formData.question}
            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.question ? 'border-red-300' : 'border-gray-200'
            }`}
            rows={3}
            placeholder="Escribe la pregunta..."
          />
          {errors.question && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.question}
            </p>
          )}
        </div>

        {/* Answer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Respuesta
          </label>
          <textarea
            value={formData.answer}
            onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.answer ? 'border-red-300' : 'border-gray-200'
            }`}
            rows={5}
            placeholder="Escribe la respuesta..."
          />
          {errors.answer && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.answer}
            </p>
          )}
        </div>

        {/* Subject and Difficulty */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Materia
            </label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.subject ? 'border-red-300' : 'border-gray-200'
              }`}
            >
              <option value="">Selecciona una materia</option>
              <option value="matematicas">Matemáticas</option>
              <option value="historia">Historia</option>
              <option value="ciencias">Ciencias</option>
              <option value="literatura">Literatura</option>
            </select>
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.subject}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dificultad Inicial
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData(prev => ({ ...prev, difficulty: Number(e.target.value) }))}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="1">Muy Fácil</option>
              <option value="2">Fácil</option>
              <option value="3">Normal</option>
              <option value="4">Difícil</option>
              <option value="5">Muy Difícil</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Etiquetas
          </label>
          <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg">
            {formData.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    tags: prev.tags.filter((_, i) => i !== index)
                  }))}
                  className="hover:text-indigo-900"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Agregar etiqueta..."
              className="flex-1 min-w-[100px] border-none focus:ring-0 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  e.preventDefault();
                  setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, e.currentTarget.value.trim()]
                  }));
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
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