import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, X, ThumbsUp, ThumbsDown, Check, Clock } from 'lucide-react';
import { FlashcardWithSpacedRepetition, ResponseQuality, FlashcardViewState } from '../../types/flashcards';

interface FlashcardPlayerProps {
  cards: FlashcardWithSpacedRepetition[];
  onComplete: () => void;
  onCardReviewed: (result: { 
    flashcardId: string;
    correct: boolean;
    responseQuality: ResponseQuality;
    timeTaken: number;
  }) => void;
  onClose?: () => void;
}

const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({
  cards,
  onComplete,
  onCardReviewed,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewState, setViewState] = useState<FlashcardViewState>(FlashcardViewState.Question);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentCard = cards[currentIndex];
  
  useEffect(() => {
    // Reiniciar temporizador cuando se muestra una nueva pregunta
    if (viewState === FlashcardViewState.Question) {
      setStartTime(Date.now());
    }
  }, [viewState, currentIndex]);
  
  const handleSwipe = (direction: 'up' | 'down') => {
    if (isAnimating) return;
    
    if (viewState === FlashcardViewState.Question) {
      // Si estamos en modo pregunta, mostrar respuesta
      setViewState(FlashcardViewState.Answer);
    } else if (viewState === FlashcardViewState.Answer) {
      // Si estamos en modo respuesta, registrar resultado y avanzar
      setSwipeDirection(direction);
      setIsAnimating(true);
      
      const timeTaken = (Date.now() - startTime) / 1000;
      
      // Determinar calidad de respuesta según dirección de deslizamiento
      let responseQuality: ResponseQuality;
      
      if (direction === 'up') {
        // Respuesta correcta (deslizamiento hacia arriba)
        responseQuality = ResponseQuality.Easy;
      } else {
        // Respuesta incorrecta (deslizamiento hacia abajo)
        responseQuality = ResponseQuality.Incorrect;
      }
      
      // Notificar al componente padre
      onCardReviewed({
        flashcardId: currentCard.id,
        correct: direction === 'up',
        responseQuality,
        timeTaken
      });
      
      // Mostrar brevemente el feedback
      setViewState(FlashcardViewState.Feedback);
      
      // Programar la transición a la siguiente tarjeta
      setTimeout(() => {
        if (currentIndex < cards.length - 1) {
          setCurrentIndex(prevIndex => prevIndex + 1);
          setViewState(FlashcardViewState.Question);
        } else {
          setViewState(FlashcardViewState.Result);
          setTimeout(() => {
            onComplete();
          }, 2000);
        }
        setIsAnimating(false);
        setSwipeDirection(null);
      }, 800);
    }
  };
  
  // Variantes para animaciones
  const cardVariants = {
    question: { rotateX: 0, y: 0 },
    answer: { rotateX: 0, y: 0 },
    swipeUp: { y: "-100vh", opacity: 0, transition: { duration: 0.7 } },
    swipeDown: { y: "100vh", opacity: 0, transition: { duration: 0.7 } },
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  if (!currentCard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">¡Completado!</h3>
          <p className="mb-4">Has terminado todas las tarjetas.</p>
          <button 
            onClick={onComplete} 
            className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 shadow-md"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black/90 flex flex-col justify-center items-center touch-none overflow-hidden"
    >
      {/* Header de navegación */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-1 bg-white/30 rounded-full w-16">
            <div 
              className="h-1 bg-white rounded-full" 
              style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            />
          </div>
          <span className="ml-3 text-white/80 text-sm">
            {currentIndex + 1}/{cards.length}
          </span>
        </div>
        <button 
          onClick={onClose} 
          className="text-white/80 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Contenedor principal de la tarjeta */}
      <div className="relative w-full h-full flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentIndex}-${viewState}`}
            className="w-full max-w-md relative"
            variants={cardVariants}
            initial="hidden"
            animate={swipeDirection ? swipeDirection === 'up' ? 'swipeUp' : 'swipeDown' : 'visible'}
            exit="hidden"
            transition={{ duration: 0.3 }}
          >
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 overflow-hidden">
              {/* Indicador de estado */}
              <div className="absolute top-3 right-3">
                {viewState === FlashcardViewState.Question ? (
                  <Clock size={18} className="text-gray-400" />
                ) : (
                  <Check size={18} className="text-green-500" />
                )}
              </div>
              
              {/* Contenido de la tarjeta */}
              <div className="min-h-[30vh] flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  {viewState === FlashcardViewState.Question ? "Pregunta" : "Respuesta"}
                </h3>
                
                <div className="text-lg text-center py-6">
                  {viewState === FlashcardViewState.Question ? (
                    <div>{currentCard.question}</div>
                  ) : (
                    <div>{currentCard.answer}</div>
                  )}
                </div>
              </div>
              
              {/* Controles inferiores */}
              <div className="mt-6 flex justify-around items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                {viewState === FlashcardViewState.Answer && (
                  <>
                    <button 
                      onClick={() => handleSwipe('down')}
                      className="flex flex-col items-center text-red-500"
                    >
                      <ThumbsDown />
                      <span className="text-sm mt-1">Incorrecto</span>
                    </button>
                    
                    <button 
                      onClick={() => handleSwipe('up')}
                      className="flex flex-col items-center text-green-500"
                    >
                      <ThumbsUp />
                      <span className="text-sm mt-1">Correcto</span>
                    </button>
                  </>
                )}
                
                {viewState === FlashcardViewState.Question && (
                  <button 
                    onClick={() => setViewState(FlashcardViewState.Answer)}
                    className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 shadow-md"
                  >
                    Ver Respuesta
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Indicadores de deslizamiento */}
      <div className="absolute inset-x-0 bottom-16 flex justify-center space-x-10">
        <div className="flex flex-col items-center text-white/70">
          <ChevronDown size={28} />
          <span className="text-sm">Incorrecto</span>
        </div>
        <div className="flex flex-col items-center text-white/70">
          <ChevronUp size={28} />
          <span className="text-sm">Correcto</span>
        </div>
      </div>
      
      {/* Progreso */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="w-full bg-white/10 rounded-full h-1">
          <div 
            className="bg-primary-500 h-1 rounded-full transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default FlashcardPlayer; 