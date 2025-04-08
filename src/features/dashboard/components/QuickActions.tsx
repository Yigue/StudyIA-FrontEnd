import React from 'react';
import { Link } from '@tanstack/react-router';
import { 
  BookOpen, 
  Plus, 
  BarChart, 
  Brain, 
  Upload, 
  Library
} from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    {
      title: 'Estudiar Flashcards',
      description: 'Inicia una sesión de estudio con tus flashcards',
      icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
      to: '/flashcards/study',
      color: 'bg-indigo-100 dark:bg-indigo-900/30',
      accent: 'from-indigo-600'
    },
    {
      title: 'Crear Flashcard',
      description: 'Crea una nueva flashcard para tu colección',
      icon: <Plus className="w-6 h-6 text-green-600" />,
      to: '/flashcards',
      color: 'bg-green-100 dark:bg-green-900/30',
      accent: 'from-green-600'
    },
    {
      title: 'Analíticas',
      description: 'Ver estadísticas detalladas de tu aprendizaje',
      icon: <BarChart className="w-6 h-6 text-purple-600" />,
      to: '/analytics',
      color: 'bg-purple-100 dark:bg-purple-900/30',
      accent: 'from-purple-600'
    },
    {
      title: 'Sesión Intensiva',
      description: 'Sesión rápida para repasar lo pendiente',
      icon: <Brain className="w-6 h-6 text-amber-600" />,
      to: '/sesion',
      color: 'bg-amber-100 dark:bg-amber-900/30',
      accent: 'from-amber-600'
    },
    {
      title: 'Subir Material',
      description: 'Sube documentos para crear flashcards',
      icon: <Upload className="w-6 h-6 text-blue-600" />,
      to: '/study',
      color: 'bg-blue-100 dark:bg-blue-900/30',
      accent: 'from-blue-600'
    },
    {
      title: 'Biblioteca',
      description: 'Explora todos tus materiales de estudio',
      icon: <Library className="w-6 h-6 text-rose-600" />,
      to: '/library',
      color: 'bg-rose-100 dark:bg-rose-900/30',
      accent: 'from-rose-600'
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Acciones Rápidas
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.to}
            className={`relative overflow-hidden ${action.color} rounded-xl p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] group`}
          >
            <div className="flex items-start gap-4">
              <div className="rounded-lg p-2 bg-white dark:bg-gray-800 shadow-sm">
                {action.icon}
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {action.description}
                </p>
              </div>
            </div>
            
            {/* Gradiente decorativo */}
            <div 
              className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${action.accent} to-transparent opacity-70 transition-all duration-300 group-hover:h-1.5`}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions; 