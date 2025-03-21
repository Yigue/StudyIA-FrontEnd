import { useState } from 'react';
import { Book } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { MaterialsList } from './components/MaterialsList';
import { MaterialDetail } from './components/MaterialDetail';
import { FlashcardReview } from './components/FlashcardReview';
import { useMaterials } from '../../hook/useMaterials';
import { useFlashcards } from '../../hook/useFlashcards';
import { StudyMaterial } from '../../types';

const LibraryPage = () => {
 
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);

  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);

  const {materials}=useMaterials()
  const {flashcards}=useFlashcards()

  console.log(flashcards)




  const handleMaterialSelect = (material: StudyMaterial) => {
    setSelectedMaterial(material);
  };

  const handleUpdateDifficulty = async (difficulty: number) => {
    if (!flashcards.length) return;
    
    const currentFlashcard = flashcards[currentFlashcardIndex];
    const nextReviewDate = new Date();
    const daysToAdd = Math.pow(2, difficulty - 1);
    nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);

    try {
      const { error } = await supabase
        .from('flashcards')
        .update({
          difficulty,
          next_review: nextReviewDate.toISOString()
        })
        .eq('id', currentFlashcard.id);

      if (error) throw error;


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
              {flashcards.length > 0 && (
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
