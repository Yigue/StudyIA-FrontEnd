import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlashcardViewState } from '../../../../../types/flashcards/ui';
import { ResponseQuality } from '../../../../../types/flashcards/spaced-repetition';
import { CheckCircle2, XCircle, Clock, Trophy } from 'lucide-react';

// Interfaz para el tipo de flashcard esperado
interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface StudyStats {
  correct: number;
  incorrect: number;
  currentStreak: number;
  cardsCompleted: number;
  total: number;
}

interface FlashcardPlayerProps {
  currentCard: Flashcard | null;
  flashcardState: FlashcardViewState;
  stats: StudyStats;
  currentIndex: number;
  totalCards: number;
  timeSpent: number;
  showFeedback: boolean;
  feedbackType: 'correct' | 'incorrect' | null;
  onShowAnswer: () => void;
  onCardResponse: (quality: ResponseQuality) => void;
  getProgressPercentage: () => number;
  formatTime: (seconds: number) => string;
}

const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({
  currentCard,
  flashcardState,
  stats,
  currentIndex,
  totalCards,
  timeSpent,
  showFeedback,
  feedbackType,
  onShowAnswer,
  onCardResponse,
  getProgressPercentage,
  formatTime
}) => {
  // Variantes de animación
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const feedbackVariants = {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 15 } },
    exit: { scale: 1.5, opacity: 0 }
  };

  // Animaciones para botones
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Barra de progreso y estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">{stats.correct}</span>
            </div>
            <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-700 dark:text-red-400">{stats.incorrect}</span>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Racha: {stats.currentStreak}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{formatTime(timeSpent)}</span>
          </div>
        </div>
        
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-600 dark:bg-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {stats.cardsCompleted} de {stats.total} tarjetas
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {getProgressPercentage()}%
          </span>
        </div>
      </motion.div>
      
      {/* Tarjeta de estudio */}
      {currentCard && (
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentIndex}-${flashcardState}`}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 min-h-[400px] flex flex-col relative overflow-hidden"
            >
              {/* Gradiente decorativo en la parte superior de la tarjeta */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              
              {/* Contenido de la tarjeta */}
              <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
                {flashcardState === FlashcardViewState.Question ? (
                  <>
                    <motion.h3 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-xl font-medium text-gray-800 dark:text-white mb-6"
                    >
                      Pregunta:
                    </motion.h3>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-full max-w-lg bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 shadow-inner"
                    >
                      <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {currentCard.question}
                      </p>
                    </motion.div>
                    <motion.button
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      onClick={onShowAnswer}
                      className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Mostrar Respuesta
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.h3 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xl font-medium text-gray-800 dark:text-white mb-2"
                    >
                      Respuesta:
                    </motion.h3>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="w-full max-w-lg bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 shadow-inner mb-8"
                    >
                      <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {currentCard.answer}
                      </p>
                    </motion.div>
                    
                    <div className="w-full max-w-lg mt-auto">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        ¿Qué tan bien lo recordaste?
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => onCardResponse(ResponseQuality.Blackout)}
                          className="py-3 px-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all shadow-md shadow-red-300 dark:shadow-red-900/30"
                        >
                          No sabía
                        </motion.button>
                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => onCardResponse(ResponseQuality.Difficult)}
                          className="py-3 px-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-all shadow-md shadow-amber-300 dark:shadow-amber-900/30"
                        >
                          Difícil
                        </motion.button>
                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => onCardResponse(ResponseQuality.Perfect)}
                          className="py-3 px-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all shadow-md shadow-green-300 dark:shadow-green-900/30"
                        >
                          Sabía
                        </motion.button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Número de tarjeta */}
              <div className="absolute bottom-4 right-4 text-xs text-gray-400 dark:text-gray-500">
                {currentIndex + 1} / {totalCards}
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Feedback visual */}
          {showFeedback && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/30 dark:bg-black/30 backdrop-blur-sm">
              <motion.div
                variants={feedbackVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`rounded-full p-10 ${
                  feedbackType === 'correct' 
                    ? 'bg-green-100 dark:bg-green-900/60' 
                    : 'bg-red-100 dark:bg-red-900/60'
                }`}
              >
                {feedbackType === 'correct' ? (
                  <CheckCircle2 className="w-20 h-20 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-20 h-20 text-red-600 dark:text-red-400" />
                )}
              </motion.div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlashcardPlayer; 