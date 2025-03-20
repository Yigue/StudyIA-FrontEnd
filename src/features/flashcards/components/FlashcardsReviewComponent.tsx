import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { mockFlashcards, mockSubjects } from '../../../lib/mockData';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: number;
  next_review: string;
  material_id: string;
  material: {
    title: string;
    subject: {
      name: string;
    }
  }
}

const FlashcardsReviewComponent = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(mockFlashcards);
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>(mockFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    difficulty: 'all',
    subject: 'all',
    status: 'all'
  });

  useEffect(() => {
    filterFlashcards();
  }, [searchTerm, filters]);

  const filterFlashcards = () => {
    let filtered = [...flashcards];

    if (searchTerm) {
      filtered = filtered.filter(card => 
        card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.material.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(card => {
        const diff = parseInt(filters.difficulty);
        return card.difficulty === diff;
      });
    }

    if (filters.subject !== 'all') {
      filtered = filtered.filter(card => 
        card.material.subject.name === filters.subject
      );
    }

    if (filters.status !== 'all') {
      const now = new Date();
      filtered = filtered.filter(card => {
        const reviewDate = new Date(card.next_review);
        switch (filters.status) {
          case 'pending':
            return reviewDate > now;
          case 'due':
            return reviewDate <= now;
          case 'completed':
            return false;
          default:
            return true;
        }
      });
    }

    setFilteredFlashcards(filtered);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const updateFlashcardDifficulty = (difficulty: number) => {
    const flashcard = filteredFlashcards[currentIndex];
    const nextReviewDate = new Date();
    const daysToAdd = Math.pow(2, difficulty - 1);
    nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);

    const updatedFlashcards = flashcards.map(fc =>
      fc.id === flashcard.id
        ? { ...fc, difficulty, next_review: nextReviewDate.toISOString() }
        : fc
    );
    setFlashcards(updatedFlashcards);
    handleNext();
  };

  const handleNext = () => {
    if (currentIndex < filteredFlashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Repaso de Flashcards</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de filtros */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700">Buscar</label>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar en flashcards..."
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700">Filtros</label>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Dificultad</label>
                    <select
                      value={filters.difficulty}
                      onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="all">Todas las dificultades</option>
                      <option value="1">Muy Fácil</option>
                      <option value="2">Fácil</option>
                      <option value="3">Normal</option>
                      <option value="4">Difícil</option>
                      <option value="5">Muy Difícil</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Materia</label>
                    <select
                      value={filters.subject}
                      onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="all">Todas las materias</option>
                      {mockSubjects.map(subject => (
                        <option key={subject.id} value={subject.name}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Estado</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="pending">Pendientes</option>
                      <option value="due">Por revisar</option>
                      <option value="completed">Completadas</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Estadísticas</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Total: {flashcards.length} flashcards
              </p>
              <p className="text-sm text-gray-600">
                Filtradas: {filteredFlashcards.length} flashcards
              </p>
              <p className="text-sm text-gray-600">
                Progreso: {currentIndex + 1} de {filteredFlashcards.length}
              </p>
            </div>
          </div>
        </div>

        {/* Área de repaso */}
        <div className="lg:col-span-2">
          {filteredFlashcards.length > 0 ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {filteredFlashcards[currentIndex].material.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {filteredFlashcards[currentIndex].material.subject.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-sm text-gray-600">
                    {currentIndex + 1} / {filteredFlashcards.length}
                  </span>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === filteredFlashcards.length - 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="font-medium text-gray-800 mb-4">
                  {filteredFlashcards[currentIndex].question}
                </p>
                {showAnswer ? (
                  <p className="text-gray-600">
                    {filteredFlashcards[currentIndex].answer}
                  </p>
                ) : (
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Mostrar respuesta
                  </button>
                )}
              </div>

              {showAnswer && (
                <div className="flex justify-center gap-4">
                  {[1, 2, 3, 4, 5].map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => updateFlashcardDifficulty(difficulty)}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className={`p-3 rounded-lg transition-colors ${
                        difficulty <= 2
                          ? 'bg-green-100 hover:bg-green-200'
                          : difficulty === 3
                          ? 'bg-yellow-100 hover:bg-yellow-200'
                          : 'bg-red-100 hover:bg-red-200'
                      }`}>
                        <Star className={`w-6 h-6 ${
                          difficulty <= 2
                            ? 'text-green-600'
                            : difficulty === 3
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`} />
                      </div>
                      <span className="text-sm text-gray-600">
                        {difficulty === 1 ? 'Muy Fácil' :
                         difficulty === 2 ? 'Fácil' :
                         difficulty === 3 ? 'Normal' :
                         difficulty === 4 ? 'Difícil' :
                         'Muy Difícil'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No se encontraron flashcards con los filtros actuales
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardsReviewComponent;