import { useState, useEffect } from 'react';
import { Book } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { StudyMaterial, Flashcard } from './types/library.types';
import { MaterialsList } from './components/MaterialsList';
import { MaterialDetail } from './components/MaterialDetail';
import { FlashcardReview } from './components/FlashcardReview';

const LibraryPage = () => {
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
          subject:subject_id!inner (name)
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

  const handleMaterialSelect = (material: StudyMaterial) => {
    setSelectedMaterial(material);
    fetchFlashcards(material.id);
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

      setFlashcards(prev => prev.map(fc => 
        fc.id === currentFlashcard.id 
          ? { ...fc, difficulty, next_review: nextReviewDate.toISOString() }
          : fc
      ));

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
                  flashcard={currentFlashcard}
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
