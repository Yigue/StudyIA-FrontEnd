import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Grid, Plus, Clock, TrendingUp } from 'lucide-react';
import { useFlashcards } from '../../../hooks/useFlashcards';

const FlashcardsHome: React.FC = () => {
  const { flashcards } = useFlashcards();
  
  // Calcular estadísticas básicas
  const totalFlashcards = flashcards?.length || 0;
  const dueForReview = flashcards?.filter(f => {
    const reviewDate = new Date(f.next_review);
    const now = new Date();
    return reviewDate <= now;
  }).length || 0;

  // Opciones de navegación para las diferentes secciones de flashcards
  const options = [
    {
      title: 'Revisar Flashcards',
      description: 'Practica las flashcards programadas para hoy',
      icon: BookOpen,
      color: 'bg-indigo-600',
      link: '/flashcards/review',
      badge: dueForReview > 0 ? `${dueForReview} pendientes` : undefined
    },
    {
      title: 'Explorar Todas',
      description: 'Navega y gestiona tu colección completa',
      icon: Grid,
      color: 'bg-teal-600',
      link: '/flashcards/dashboard',
      badge: totalFlashcards > 0 ? `${totalFlashcards} en total` : undefined
    },
    {
      title: 'Crear Flashcard',
      description: 'Añade nuevas flashcards a tu colección',
      icon: Plus,
      color: 'bg-green-600',
      link: '/flashcards/dashboard?create=true'
    },
    {
      title: 'Estadísticas',
      description: 'Revisa tu progreso y rendimiento',
      icon: TrendingUp,
      color: 'bg-purple-600',
      link: '/flashcards/stats'
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sistema de Flashcards</h2>
        <p className="text-gray-600">
          Organiza, crea y revisa tus flashcards para mejorar tu aprendizaje
        </p>
      </div>

      {/* Tarjeta de progreso */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-orange-50 rounded-lg">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Próximas revisiones</h3>
            <p className="text-sm text-gray-600">
              {dueForReview > 0 
                ? `Tienes ${dueForReview} flashcards pendientes de revisión`
                : 'No tienes flashcards pendientes de revisión'}
            </p>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-orange-600 h-2.5 rounded-full" 
            style={{ width: `${Math.min(100, (dueForReview / Math.max(1, totalFlashcards)) * 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Opciones de navegación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <Link 
            key={index}
            to={option.link}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 ${option.color} rounded-lg`}>
                <option.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">{option.title}</h3>
                  {option.badge && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{option.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Sugerencias o mensajes motivacionales */}
      {totalFlashcards === 0 && (
        <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            ¡Comienza tu aprendizaje con flashcards!
          </h3>
          <p className="text-blue-700 mb-4">
            Las flashcards son una herramienta efectiva para memorizar información importante.
            Crea tu primera flashcard para empezar.
          </p>
          <Link 
            to="/flashcards/dashboard?create=true"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear mi primera flashcard
          </Link>
        </div>
      )}
    </div>
  );
};

export default FlashcardsHome; 