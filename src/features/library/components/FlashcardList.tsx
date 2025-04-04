import React, { useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/badge";
import { ChevronLeft, ChevronRight, Lightbulb, ThumbsUp, ThumbsDown, Zap } from "lucide-react";
import { Flashcard } from "@/types";

interface FlashcardListProps {
  flashcards: Flashcard[];
  onDifficultyChange?: (id: string, difficulty: "easy" | "medium" | "hard") => void;
}

export const FlashcardList: React.FC<FlashcardListProps> = ({ 
  flashcards, 
  onDifficultyChange 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  if (flashcards.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="bg-gray-800/50 rounded-full p-4 mb-4">
          <Lightbulb className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">
          No hay tarjetas disponibles
        </h3>
        <p className="text-gray-400 text-sm text-center max-w-md">
          Genera tarjetas usando la opción "Generar Contenido" en este material
          para crear flashcards de estudio automáticamente.
        </p>
      </div>
    );
  }

  const currentFlashcard = flashcards[currentIndex];
  
  // Navegar a la tarjeta anterior
  const goToPrevious = () => {
    if (isFlipping) return;
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };
  
  // Navegar a la tarjeta siguiente
  const goToNext = () => {
    if (isFlipping) return;
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : prev));
  };

  // Obtener color según dificultad
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-400 bg-green-900/20 border-green-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-500/30";
      case "hard":
        return "text-red-400 bg-red-900/20 border-red-500/30";
      default:
        return "text-gray-400 bg-gray-800 border-gray-700";
    }
  };

  // Obtener texto de dificultad en español
  const getDifficultyText = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "Fácil";
      case "medium":
        return "Media";
      case "hard":
        return "Difícil";
      default:
        return "Normal";
    }
  };

  // Obtener icono según dificultad
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return <ThumbsUp className="h-3 w-3 mr-1" />;
      case "medium":
        return <Zap className="h-3 w-3 mr-1" />;
      case "hard":
        return <ThumbsDown className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const toggleAnswer = () => {
    setIsFlipping(true);
    setShowAnswer(!showAnswer);
    setTimeout(() => setIsFlipping(false), 300);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Indicador de progreso */}
      <div className="mb-5 px-1">
        <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
          <span>Tarjeta {currentIndex + 1} de {flashcards.length}</span>
          
          {currentFlashcard.difficulty && (
            <div className="flex items-center">
              <Badge className={`flex items-center px-2 py-0.5 text-xs font-normal ${getDifficultyColor(currentFlashcard.difficulty.toString())}`}>
                {getDifficultyIcon(currentFlashcard.difficulty.toString())}
                {getDifficultyText(currentFlashcard.difficulty.toString())}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-500 h-1 transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Tarjeta principal */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full flex items-center justify-center">
          <Card className="w-full max-w-xl bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700 shadow-xl overflow-hidden">
            <div className="p-5 h-full flex flex-col">
              <div className="flex-1 flex flex-col justify-center p-3">
                <div 
                  className={`transition-opacity duration-300 ${isFlipping ? 'opacity-0' : 'opacity-100'}`}
                >
                  {!showAnswer ? (
                    <div className="py-12">
                      <h3 className="text-xl font-medium text-center mb-2">
                        {currentFlashcard.question}
                      </h3>
                      <div className="text-center mt-6">
                        <Button 
                          onClick={toggleAnswer} 
                          className="bg-indigo-600 hover:bg-indigo-700 transition-all"
                        >
                          <Lightbulb className="h-4 w-4 mr-2" />
                          Ver Respuesta
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6">
                      <div className="rounded-lg bg-gray-800/50 p-4 mb-6">
                        <div className="text-xs text-gray-400 uppercase mb-1 font-medium">Pregunta</div>
                        <p className="text-gray-300">{currentFlashcard.question}</p>
                      </div>
                      
                      <div className="rounded-lg bg-indigo-900/20 border border-indigo-500/20 p-4 mb-6">
                        <div className="text-xs text-indigo-400 uppercase mb-1 font-medium">Respuesta</div>
                        <p className="text-white">{currentFlashcard.answer}</p>
                      </div>
                      
                      {onDifficultyChange && (
                        <div className="mb-4">
                          <div className="text-xs text-gray-400 mb-2 font-medium">¿Qué tal lo has hecho?</div>
                          <div className="grid grid-cols-3 gap-2">
                            <Button
                              variant="outline"
                              className="border-green-600/30 text-green-400 hover:bg-green-900/20 transition-colors"
                              onClick={() => onDifficultyChange(currentFlashcard.id, "easy")}
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              Fácil
                            </Button>
                            <Button
                              variant="outline"
                              className="border-yellow-600/30 text-yellow-400 hover:bg-yellow-900/20 transition-colors"
                              onClick={() => onDifficultyChange(currentFlashcard.id, "medium")}
                            >
                              <Zap className="h-4 w-4 mr-1" />
                              Medio
                            </Button>
                            <Button
                              variant="outline"
                              className="border-red-600/30 text-red-400 hover:bg-red-900/20 transition-colors"
                              onClick={() => onDifficultyChange(currentFlashcard.id, "hard")}
                            >
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              Difícil
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <Button 
                          onClick={toggleAnswer}
                          variant="ghost" 
                          className="text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                        >
                          Ocultar Respuesta
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Navegación de tarjetas */}
              <div className="flex justify-between mt-auto pt-3">
                <Button
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  onClick={goToPrevious}
                  disabled={currentIndex === 0 || isFlipping}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <Button
                  variant="ghost"
                  className="text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  onClick={goToNext}
                  disabled={currentIndex === flashcards.length - 1 || isFlipping}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}; 