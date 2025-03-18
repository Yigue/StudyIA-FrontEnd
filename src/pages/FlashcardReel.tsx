import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useStudyStore } from '../lib/store';
import { ChevronUp, ChevronDown, Check, X, Trophy, Star, Siren as Fire, Zap } from 'lucide-react';
import useSound from 'use-sound';
import Confetti from 'react-confetti';

interface FlashcardProps {
  card: any;
  isActive: boolean;
  onComplete: (status: 'learned' | 'review') => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ 
  card, 
  isActive, 
  onComplete, 
  onNext, 
  onPrevious 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [dragDirection, setDragDirection] = useState<string | null>(null);
  const controls = useAnimation();

  // Sonidos de interacción
  const [playSuccess] = useSound('/success.mp3');
  const [playFlip] = useSound('/flip.mp3');
  const [playSwipe] = useSound('/swipe.mp3');

  const handleDragEnd = async (event: any, info: any) => {
    const threshold = 100;
    const velocity = Math.abs(info.velocity.x);
    const direction = info.offset.x > 0 ? 'right' : 'left';
    
    if (Math.abs(info.offset.x) > threshold || velocity > 800) {
      playSwipe();
      await controls.start({
        x: direction === 'right' ? 500 : -500,
        opacity: 0,
        transition: { duration: 0.3 }
      });
      onComplete(direction === 'right' ? 'learned' : 'review');
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  const handleTap = () => {
    playFlip();
    setIsFlipped(!isFlipped);
  };

  const gradientStyle = {
    background: `linear-gradient(135deg, 
      ${card.subject === 'Matemáticas' ? '#4F46E5, #818CF8' :
        card.subject === 'Historia' ? '#059669, #34D399' :
        card.subject === 'Ciencias' ? '#9333EA, #C084FC' :
        '#2563EB, #60A5FA'})`
  };

  return (
    <motion.div
      className={`w-full h-[80vh] rounded-3xl shadow-xl overflow-hidden ${
        isActive ? 'relative z-10' : 'absolute top-0 left-0 pointer-events-none'
      }`}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ opacity: 1, x: 0 }}
      style={gradientStyle}
    >
      <motion.div
        className="w-full h-full bg-white/90 backdrop-blur-sm p-8 flex flex-col"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="text-2xl font-medium text-gray-800 text-center"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
          >
            {isFlipped ? card.answer : card.question}
          </motion.div>
        </div>

        {/* Indicadores de deslizamiento */}
        <div className="absolute inset-x-0 top-4 flex justify-center">
          <ChevronUp className="w-8 h-8 text-gray-400 animate-bounce" />
        </div>
        <div className="absolute inset-x-0 bottom-4 flex justify-center">
          <ChevronDown className="w-8 h-8 text-gray-400 animate-bounce" />
        </div>
        <div className="absolute inset-y-0 left-4 flex items-center">
          <X className="w-8 h-8 text-gray-400" />
        </div>
        <div className="absolute inset-y-0 right-4 flex items-center">
          <Check className="w-8 h-8 text-gray-400" />
        </div>

        {/* Botón para voltear */}
        <button
          onClick={handleTap}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 
                     px-6 py-2 bg-white/20 rounded-full text-gray-800 
                     backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          Tocar para {isFlipped ? 'pregunta' : 'respuesta'}
        </button>
      </motion.div>
    </motion.div>
  );
};

const FlashcardReel = () => {
  const { 
    flashcards, 
    currentFlashcard,
    progress,
    updateProgress,
    setCurrentFlashcard 
  } = useStudyStore();

  const [showConfetti, setShowConfetti] = useState(false);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);

  const handleComplete = (status: 'learned' | 'review') => {
    updateProgress(status === 'learned');
    
    // Verificar logros
    if (progress.cardsStudied % 10 === 0) {
      setShowConfetti(true);
      setShowAchievement('¡10 tarjetas más completadas!');
      setTimeout(() => {
        setShowConfetti(false);
        setShowAchievement(null);
      }, 3000);
    }

    setCurrentFlashcard(currentFlashcard + 1);
  };

  return (
    <div className="relative w-full h-screen bg-gray-100">
      {/* Barra de progreso superior */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Fire className="w-5 h-5 text-orange-500" />
              <span className="font-medium">{progress.streak} días</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">{progress.cardsStudied * 10} XP</span>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ 
                width: `${(currentFlashcard / flashcards.length) * 100}%` 
              }}
            />
          </div>
          <div className="flex justify-between mt-1 text-sm text-gray-600">
            <span>{currentFlashcard + 1} de {flashcards.length}</span>
            <span>{Math.round((currentFlashcard / flashcards.length) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Contenedor de flashcards */}
      <div className="relative w-full max-w-md mx-auto h-full pt-20">
        <AnimatePresence>
          {flashcards.map((card, index) => (
            <Flashcard
              key={card.id}
              card={card}
              isActive={index === currentFlashcard}
              onComplete={handleComplete}
              onNext={() => setCurrentFlashcard(Math.min(currentFlashcard + 1, flashcards.length - 1))}
              onPrevious={() => setCurrentFlashcard(Math.max(currentFlashcard - 1, 0))}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Confetti y logros */}
      {showConfetti && <Confetti />}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 
                       bg-white rounded-full px-6 py-3 shadow-lg
                       flex items-center gap-2"
          >
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">{showAchievement}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlashcardReel;