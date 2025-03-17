import { useState, useEffect } from 'react';
import { Book, BookOpen, LayoutGrid, Star, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface StudyMaterial {
  id: string;
  title: string;
  content: string;
  summary: string;
  created_at: string;
  subject: {
    name: string;
  };
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: number;
  next_review: string;
  material_id: string;
}

const Library = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const { data, error } = await supabase
        .from('study_materials')
        .select(`
          id,
          title,
          content,
          summary,
          created_at,
          subject:subject_id (name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error al cargar materiales:', error);
    }
  };

  const fetchFlashcards = async (materialId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('material_id', materialId)
        .eq('user_id', user.id)
        .order('next_review', { ascending: true });

      if (error) throw error;
      setFlashcards(data || []);
      setCurrentFlashcardIndex(0);
      setShowAnswer(false);
    } catch (error) {
      console.error('Error al cargar flashcards:', error);
    }
  };

  const updateFlashcardDifficulty = async (flashcard: Flashcard, difficulty: number) => {
    try {
      const nextReviewDate = new Date();
      // Ajustar la fecha de próxima revisión según la dificultad (en días)
      const daysToAdd = Math.pow(2, difficulty - 1); // 1 día para dificultad 1, 2 días para 2, 4 días para 3, etc.
      nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);

      const { error } = await supabase
        .from('flashcards')
        .update({
          difficulty,
          next_review: nextReviewDate.toISOString()
        })
        .eq('id', flashcard.id);

      if (error) throw error;

      // Actualizar el estado local
      setFlashcards(prev => prev.map(fc => 
        fc.id === flashcard.id 
          ? { ...fc, difficulty, next_review: nextReviewDate.toISOString() }
          : fc
      ));

      // Pasar a la siguiente flashcard
      if (currentFlashcardIndex < flashcards.length - 1) {
        setCurrentFlashcardIndex(prev => prev + 1);
        setShowAnswer(false);
      }
    } catch (error) {
      console.error('Error al actualizar flashcard:', error);
    }
  };

  const currentFlashcard = flashcards[currentFlashcardIndex];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Biblioteca</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de materiales */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Book className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Materiales</h3>
            </div>
            <div className="space-y-3">
              {materials.map((material) => (
                <button
                  key={material.id}
                  onClick={() => {
                    setSelectedMaterial(material);
                    fetchFlashcards(material.id);
                  }}
                  className={`w-full p-4 rounded-lg text-left transition-colors ${
                    selectedMaterial?.id === material.id
                      ? 'bg-indigo-50 border border-indigo-100'
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
                  }`}
                >
                  <h4 className="font-medium text-gray-800">{material.title}</h4>
                  <p className="text-sm text-gray-600">{material.subject.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(material.created_at).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido del material seleccionado */}
        <div className="lg:col-span-2 space-y-6">
          {selectedMaterial ? (
            <>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{selectedMaterial.title}</h3>
                    <p className="text-sm text-gray-600">{selectedMaterial.subject.name}</p>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <h4 className="text-gray-800 font-medium mb-2">Resumen</h4>
                  <p className="text-gray-600 whitespace-pre-line">{selectedMaterial.summary}</p>
                </div>
              </div>

              {flashcards.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-50 rounded-lg">
                        <LayoutGrid className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Flashcards ({currentFlashcardIndex + 1} de {flashcards.length})
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        Próxima revisión: {new Date(currentFlashcard.next_review).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg mb-4">
                    <p className="font-medium text-gray-800 mb-4">{currentFlashcard.question}</p>
                    {showAnswer ? (
                      <p className="text-gray-600">{currentFlashcard.answer}</p>
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
                          onClick={() => updateFlashcardDifficulty(currentFlashcard, difficulty)}
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
              )}
            </>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Selecciona un material para ver su contenido y flashcards
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;