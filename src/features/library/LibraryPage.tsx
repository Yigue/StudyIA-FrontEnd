import { useState, useEffect } from 'react';
import { Book } from 'lucide-react';
import { MaterialsList } from './components/MaterialsList';
import { MaterialDetail } from './components/MaterialDetail';
import { FlashcardReview } from './components/FlashcardReview';
import { useMaterials, useMaterialsActions } from '../../hook/useMaterials';
import { useFlashcards, useFlashcardsActions } from '../../hook/useFlashcards';
import { StudyMaterial } from '../../types';

const LibraryPage = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);

  const { materials } = useMaterials();
  const { getAllMaterials } = useMaterialsActions();
  const { flashcards } = useFlashcards();
  const { getFlashcardsByMaterial, updateFlashcardReview } = useFlashcardsActions();

  // Cargar materiales al montar el componente
  useEffect(() => {
    getAllMaterials();
  }, [getAllMaterials]);

  const handleMaterialSelect = (material: StudyMaterial) => {
    
    setSelectedMaterial(material);
    // Cargar flashcards relacionadas con el material seleccionado
    if (material && material.id) {
      getFlashcardsByMaterial(material.id);
      setCurrentFlashcardIndex(0);
      setShowAnswer(false);
    }
  };

  const handleUpdateDifficulty = async (difficulty: number) => {
    if (!flashcards.length) return;
    
    const currentFlashcard = flashcards[currentFlashcardIndex];
    const nextReviewDate = new Date();
    const daysToAdd = Math.pow(2, difficulty - 1);
    nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);

    try {
      // Usar el hook para actualizar la dificultad
      await updateFlashcardReview(currentFlashcard.id, {
        difficulty,
        next_review: nextReviewDate.toISOString()
      });

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
        <div className="lg:col-span-1">
          <MaterialsList 
            materials={materials}
            selectedMaterial={selectedMaterial}
            onSelectMaterial={handleMaterialSelect}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedMaterial ? (
            <>
              <MaterialDetail material={selectedMaterial} />
              {flashcards.length > 0 && currentFlashcard ? (
                <FlashcardReview
                  flashcard={{
                    ...currentFlashcard,
                    next_review: new Date(currentFlashcard.next_review)
                  }}
                  totalFlashcards={flashcards.length}
                  currentIndex={currentFlashcardIndex}
                  showAnswer={showAnswer}
                  onToggleAnswer={() => setShowAnswer(true)}
                  onUpdateDifficulty={handleUpdateDifficulty}
                />
              ) : (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <p className="text-gray-600">
                    No hay flashcards disponibles para este material
                  </p>
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

export default LibraryPage;
