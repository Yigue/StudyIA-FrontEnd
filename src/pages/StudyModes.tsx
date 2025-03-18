import React from 'react';
import { Brain, Book, Lightbulb } from 'lucide-react';
import { useStudyStore } from '../lib/store';

const StudyModes = () => {
  const { studyMode, setStudyMode } = useStudyStore();

  const modes = [
    {
      id: 'test',
      name: 'Modo Test',
      description: 'Evalúa tu conocimiento con preguntas aleatorias',
      icon: Brain,
      color: 'blue'
    },
    {
      id: 'review',
      name: 'Repaso',
      description: 'Repasa las tarjetas según el sistema espaciado',
      icon: Book,
      color: 'green'
    },
    {
      id: 'memorize',
      name: 'Memorización',
      description: 'Enfócate en memorizar nuevo contenido',
      icon: Lightbulb,
      color: 'yellow'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => setStudyMode(mode.id as 'test' | 'review' | 'memorize')}
          className={`p-4 rounded-xl border transition-all ${
            studyMode === mode.id
              ? `bg-${mode.color}-50 border-${mode.color}-200`
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className={`w-12 h-12 rounded-lg bg-${mode.color}-100 p-3 mb-3`}>
            <mode.icon className={`w-full h-full text-${mode.color}-600`} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{mode.name}</h3>
          <p className="text-sm text-gray-600">{mode.description}</p>
        </button>
      ))}
    </div>
  );
};

export default StudyModes;