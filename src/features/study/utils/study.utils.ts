import { supabase } from '../../../lib/supabase';
import {AnalysisResult } from '../types/study.types';

export const fetchSubjectsFromDB = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('subjects')
    .select('id, name')
    .eq('user_id', user.id)
    .order('name');
  
  if (error) throw error;
  return data || [];
};

export const createNewSubjectInDB = async (name: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('subjects')
    .insert([{ 
      name,
      user_id: user.id 
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const saveMaterialAndFlashcardsInDB = async (
  text: string,
  result: AnalysisResult,
  selectedSubject: string,
  title: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const { data: material, error: materialError } = await supabase
    .from('study_materials')
    .insert([{
      title,
      content: text,
      summary: result.summary,
      subject_id: selectedSubject,
      user_id: user.id
    }])
    .select()
    .single();

  if (materialError) throw materialError;

  const flashcardsData = result.flashcards.map(fc => ({
    question: fc.question,
    answer: fc.answer,
    material_id: material.id,
    user_id: user.id,
    difficulty: 3,
    next_review: new Date().toISOString()
  }));

  const { error: flashcardsError } = await supabase
    .from('flashcards')
    .insert(flashcardsData);

  if (flashcardsError) throw flashcardsError;

  return material;
};
