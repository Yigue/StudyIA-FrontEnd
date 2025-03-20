import { useState, useEffect } from 'react';
import { useFlashcardsStore } from '../store/flashcardsStore';
import { FlashcardFilters } from '../types/flashcards.types';

export const useFlashcardsReview = () => {
  const { flashcards, filteredFlashcards, setFlashcards, filterFlashcards } = useFlashcardsStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FlashcardFilters>({
    difficulty: 'all',
    subject: 'all',
    status: 'all'
  });

  useEffect(() => {
    filterFlashcards();
  }, [searchTerm, filters]);

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

  const updateDifficulty = (difficulty: number) => {
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

  return {
    currentFlashcard: filteredFlashcards[currentIndex],
    stats: {
      total: flashcards.length,
      filtered: filteredFlashcards.length,
      current: currentIndex + 1,
    },
    showAnswer,
    searchTerm,
    filters,
    actions: {
      setSearchTerm,
      setFilters,
      toggleAnswer: () => setShowAnswer(!showAnswer),
      handleNext,
      handlePrevious,
      updateDifficulty
    }
  };
};