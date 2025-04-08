import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Clock, 
  ThumbsUp, 
  ThumbsDown 
} from 'lucide-react';
import { Flashcard, ReviewResult } from '../../../../types';


interface FlashcardPlayerProps {
  cards: Flashcard[];
  onComplete: () => void;
  onCardReviewed: (result: {
    flashcardId: string;
    correct: boolean;
    responseQuality: ReviewResult;
    timeTaken: number;
  }) => void;
  onClose: () => void;
  darkMode?: boolean;
}

const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({
  cards,
  onComplete,
  onCardReviewed,
  onClose,
  darkMode = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [responseOptions, setResponseOptions] = useState<boolean>(false);
  
  // Opciones de calidad de respuesta
  const responseQualities: ResponseQuality[] = [
    { value: 0, label: 'Totalmente olvidada' },
    { value: 1, label: 'Respuesta incorrecta' },
    { value: 2, label: 'Respuesta correcta pero difícil' },
    { value: 3, label: 'Respuesta correcta con esfuerzo' },
    { value: 4, label: 'Respuesta correcta' },
    { value: 5, label: 'Respuesta perfecta' }
  ];
  
  const currentCard = cards[currentIndex];
  const progress = (currentIndex / cards.length) * 100;
  const isLastCard = currentIndex === cards.length - 1;
  
  // Iniciar el temporizador al montar el componente y al cambiar de tarjeta
  useEffect(() => {
    setStartTime(Date.now());
    setIsFlipped(false);
    setResponseOptions(false);
  }, [currentIndex]);
  
  // Función para manejar el volteo de la tarjeta
  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      // Calcular el tiempo tomado para ver la pregunta
      if (startTime) {
        const timeSpent = (Date.now() - startTime) / 1000; // en segundos
        setTimeTaken(timeSpent);
      }
      // Mostrar opciones de respuesta después de voltear
      setResponseOptions(true);
    }
  };
  
  // Función para manejar la respuesta
  const handleResponse = (responseQuality: ResponseQuality, correct: boolean) => {
    if (!currentCard) return;
    
    onCardReviewed({
      flashcardId: currentCard.id,
      correct,
      responseQuality,
      timeTaken
    });
    
    // Avanzar a la siguiente tarjeta o completar
    if (isLastCard) {
      onComplete();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  // Si no hay tarjetas, mostrar mensaje
  if (cards.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 h-96 rounded-xl ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
        <RotateCcw className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No hay tarjetas para estudiar</h2>
        <p className="text-center text-gray-400 max-w-md">
          No hay tarjetas disponibles para esta sesión de estudio. Intenta ajustar los filtros o crear nuevas tarjetas.
        </p>
        <button 
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          Volver
        </button>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen w-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Barra superior con progreso y controles */}
      <div className={`fixed top-0 left-0 right-0 z-20 p-4 ${darkMode ? 'bg-gray-900/50 backdrop-blur-md' : 'bg-white/50 backdrop-blur-md'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={onClose}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {currentIndex + 1} / {cards.length}
              </span>
              <Clock className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className={`h-1 w-full rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Tarjeta principal */}
      <div className="pt-20 pb-24 px-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`relative aspect-[4/3] rounded-2xl shadow-lg overflow-hidden cursor-pointer ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
              onClick={handleFlip}
            >
              <motion.div
                className="absolute inset-0 p-8 flex flex-col"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Frente: Pregunta */}
                <div 
                  className={`absolute inset-0 backface-hidden p-8 flex flex-col ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="flex-1 flex items-center justify-center text-center">
                    <h3 className="text-2xl font-medium">{currentCard.question}</h3>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Toca para ver la respuesta
                    </p>
                  </div>
                </div>
                
                {/* Reverso: Respuesta */}
                <div 
                  className={`absolute inset-0 backface-hidden p-8 flex flex-col transform rotate-y-180 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="flex-1 flex items-center justify-center text-center">
                    <p className="text-xl">{currentCard.answer}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Barra inferior con botones de respuesta */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 ${
        darkMode ? 'bg-gray-900/50 backdrop-blur-md' : 'bg-white/50 backdrop-blur-md'
      }`}>
        <div className="max-w-xl mx-auto">
          {!responseOptions ? (
            <div className="flex justify-center">
              <button
                onClick={handleFlip}
                className={`px-6 py-3 rounded-lg ${
                  darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                Mostrar Respuesta
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between">
                <button
                  onClick={() => handleResponse(responseQualities[1], false)}
                  className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  <ThumbsDown className="w-5 h-5" />
                  <span>No sabía</span>
                </button>
                
                <button
                  onClick={() => handleResponse(responseQualities[3], true)}
                  className="flex items-center gap-2 px-5 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Difícil</span>
                </button>
                
                <button
                  onClick={() => handleResponse(responseQualities[5], true)}
                  className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>Sabía</span>
                </button>
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className={`p-2 rounded-lg ${
                    currentIndex === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : darkMode 
                      ? 'hover:bg-gray-800 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={() => {
                    if (isLastCard) {
                      onComplete();
                    } else {
                      setCurrentIndex(prev => prev + 1);
                    }
                  }}
                  className={`p-2 rounded-lg ${
                    darkMode 
                    ? 'hover:bg-gray-800 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {isLastCard ? 'Terminar' : <ChevronRight className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardPlayer; 