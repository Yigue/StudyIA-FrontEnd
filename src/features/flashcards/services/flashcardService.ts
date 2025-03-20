import { supabase } from '../../../lib/supabase';
import { Flashcard } from '../../../types';


export const flashcardService = {
  getFlashcards: async () => {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*');
    if (error) throw error;
    return data;
  },
  
  updateFlashcard: async (id: string, updates: Partial<Flashcard>) => {
    const { data, error } = await supabase
      .from('flashcards')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
    return data;
  },
  
  createFlashcard: async (flashcard: Partial<Flashcard>) => {
    const { data, error } = await supabase
      .from('flashcards')
      .insert(flashcard);
    if (error) throw error;
    return data;
  }
};