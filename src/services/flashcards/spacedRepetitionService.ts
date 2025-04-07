import {
  SpacedRepetitionState,
  ResponseQuality,
  SpacedRepetitionConfig,
  KnowledgeLevel,
  FlashcardWithSpacedRepetition,
  ReviewResult
} from '../../types/flashcards';

/**
 * Implementación del algoritmo SuperMemo-2 (SM-2) para repetición espaciada
 * 
 * Basado en: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */

// Configuración por defecto del algoritmo
const DEFAULT_SM2_CONFIG: SpacedRepetitionConfig = {
  initialEaseFactor: 2.5,     // Factor de facilidad inicial
  minEaseFactor: 1.3,         // Factor de facilidad mínimo
  initialInterval: 1,         // Intervalo inicial en días
  easyBonus: 1.3,             // Bonus para respuestas muy fáciles
  hardPenalty: 0.8,           // Penalización para respuestas difíciles
  lapseNewInterval: 0.5,      // Fracción del intervalo tras un fallo
  maxInterval: 365,           // Intervalo máximo en días
  difficultyWeight: 0.15,     // Peso de la dificultad en el cálculo
};

/**
 * Inicializa el estado de repetición espaciada para una nueva flashcard
 */
export function initializeSpacedRepetition(): SpacedRepetitionState {
  return {
    easeFactor: DEFAULT_SM2_CONFIG.initialEaseFactor,
    interval: 0,
    repetitions: 0,
    dueDate: new Date(),
    knowledgeLevel: KnowledgeLevel.New,
    streak: 0
  };
}

/**
 * Calcula el siguiente estado de repetición espaciada basado en el rendimiento
 * 
 * @param currentState Estado actual de repetición espaciada
 * @param responseQuality Calidad de la respuesta (0-5)
 * @param config Configuración del algoritmo (opcional)
 * @returns Nuevo estado de repetición espaciada
 */
export function calculateNextState(
  currentState: SpacedRepetitionState,
  responseQuality: ResponseQuality,
  config: Partial<SpacedRepetitionConfig> = {}
): SpacedRepetitionState {
  // Fusionar con la configuración por defecto
  const mergedConfig = { ...DEFAULT_SM2_CONFIG, ...config };
  
  // Crear copia del estado actual para actualizarla
  const newState: SpacedRepetitionState = { 
    ...currentState,
    lastReviewDate: new Date()
  };
  
  // Si la respuesta fue incorrecta (calidad < 3), reiniciar repeticiones
  if (responseQuality < ResponseQuality.Hesitation) {
    // Lapse: reducir intervalo y repeticiones
    newState.repetitions = 0;
    newState.interval = Math.max(
      1,
      Math.floor(currentState.interval * mergedConfig.lapseNewInterval)
    );
    
    // Reducir factor de facilidad pero no por debajo del mínimo
    newState.easeFactor = Math.max(
      mergedConfig.minEaseFactor,
      currentState.easeFactor - 0.2
    );
    
    // Actualizar nivel de conocimiento
    if (currentState.knowledgeLevel > KnowledgeLevel.Learning) {
      newState.knowledgeLevel = KnowledgeLevel.Learning;
    }
    
    // Reiniciar racha
    newState.streak = 0;
  } else {
    // Respuesta correcta: aumentar repeticiones
    newState.repetitions = currentState.repetitions + 1;
    
    // Actualizar racha
    newState.streak = currentState.streak + 1;
    
    // Calcular nuevo intervalo según el número de repeticiones
    if (newState.repetitions === 1) {
      newState.interval = mergedConfig.initialInterval;
    } else if (newState.repetitions === 2) {
      newState.interval = Math.max(3, mergedConfig.initialInterval * 3);
    } else {
      // Aplicar algoritmo SM-2 para el nuevo intervalo
      newState.interval = Math.ceil(currentState.interval * currentState.easeFactor);
      
      // Aplicar bonificación para respuestas fáciles
      if (responseQuality >= ResponseQuality.Easy) {
        newState.interval = Math.ceil(newState.interval * mergedConfig.easyBonus);
      }
      
      // Aplicar penalización para respuestas difíciles pero correctas
      if (responseQuality === ResponseQuality.Hesitation) {
        newState.interval = Math.ceil(newState.interval * mergedConfig.hardPenalty);
      }
    }
    
    // Limitar el intervalo máximo
    newState.interval = Math.min(newState.interval, mergedConfig.maxInterval);
    
    // Actualizar factor de facilidad basado en la calidad de respuesta
    newState.easeFactor = currentState.easeFactor + 
      (0.1 - (5 - responseQuality) * (0.08 + (5 - responseQuality) * 0.02));
    
    // Limitar el factor de facilidad al mínimo
    newState.easeFactor = Math.max(mergedConfig.minEaseFactor, newState.easeFactor);
    
    // Actualizar nivel de conocimiento
    if (newState.repetitions >= 4 && responseQuality >= ResponseQuality.Easy) {
      newState.knowledgeLevel = KnowledgeLevel.Mastered;
    } else if (newState.repetitions >= 2) {
      newState.knowledgeLevel = KnowledgeLevel.Review;
    } else {
      newState.knowledgeLevel = KnowledgeLevel.Learning;
    }
  }
  
  // Calcular la próxima fecha de vencimiento
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + newState.interval);
  newState.dueDate = dueDate;
  
  return newState;
}

/**
 * Procesa una revisión de flashcard y devuelve el resultado
 */
export function processReview(
  flashcard: FlashcardWithSpacedRepetition,
  responseQuality: ResponseQuality,
  timeTaken: number
): ReviewResult {
  const oldState = flashcard.spacedRepetition;
  const newState = calculateNextState(oldState, responseQuality);
  
  return {
    flashcard,
    responseQuality,
    oldState,
    newState,
    timeTaken,
    answerCorrect: responseQuality >= ResponseQuality.Hesitation
  };
}

/**
 * Calcula la urgencia de revisar una flashcard (0-1)
 * Valores más altos indican mayor urgencia
 */
export function calculateUrgency(card: FlashcardWithSpacedRepetition): number {
  if (card.spacedRepetition.knowledgeLevel === KnowledgeLevel.New) {
    return 1; // Las nuevas tarjetas tienen máxima prioridad
  }
  
  const now = new Date();
  const dueDate = new Date(card.spacedRepetition.dueDate);
  
  // Si ya está vencida
  if (dueDate <= now) {
    const daysOverdue = (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24);
    // La urgencia aumenta con los días de retraso, pero con un límite
    return Math.min(1, 0.8 + daysOverdue / 10);
  }
  
  // Si aún no está vencida
  const daysUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  
  // Calcular urgencia inversa a los días restantes
  // 0 días = 0.8 urgencia, 7 días = 0 urgencia
  return Math.max(0, 0.8 - (daysUntilDue / 8.75));
}

/**
 * Calcula la probabilidad estimada de recordar una flashcard (0-1)
 */
export function calculateRetentionProbability(card: FlashcardWithSpacedRepetition): number {
  const now = new Date();
  const lastReviewDate = card.spacedRepetition.lastReviewDate || new Date(card.createdAt || now);
  const daysSinceLastReview = (now.getTime() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24);
  
  // Modelo simple de curva de olvido de Ebbinghaus: R = e^(-t/S)
  // Donde:
  // - R es la retención
  // - t es el tiempo transcurrido
  // - S es la fuerza de la memoria (relacionada con el intervalo y factor de facilidad)
  
  const memoryStrength = card.spacedRepetition.interval * card.spacedRepetition.easeFactor;
  
  // Si nunca se ha revisado, usar un valor bajo
  if (memoryStrength === 0) {
    return 0.3;
  }
  
  // Calcular probabilidad usando la fórmula de Ebbinghaus
  const probability = Math.exp(-daysSinceLastReview / memoryStrength);
  
  // Garantizar que esté entre 0 y 1
  return Math.max(0, Math.min(1, probability));
}

/**
 * Ordena las flashcards por prioridad para estudio
 */
export function sortCardsByPriority(cards: FlashcardWithSpacedRepetition[]): FlashcardWithSpacedRepetition[] {
  return [...cards].sort((a, b) => {
    // Primero, ordenar por nivel de conocimiento (nuevas primero)
    if (a.spacedRepetition.knowledgeLevel !== b.spacedRepetition.knowledgeLevel) {
      return a.spacedRepetition.knowledgeLevel - b.spacedRepetition.knowledgeLevel;
    }
    
    // Luego, por urgencia de revisión
    const urgencyA = calculateUrgency(a);
    const urgencyB = calculateUrgency(b);
    
    if (Math.abs(urgencyA - urgencyB) > 0.1) {
      return urgencyB - urgencyA;
    }
    
    // Finalmente, por dificultad (más difíciles primero)
    const difficultyA = typeof a.difficulty === 'number' ? a.difficulty : 
                       (a.difficulty === 'hard' ? 3 : (a.difficulty === 'medium' ? 2 : 1));
    const difficultyB = typeof b.difficulty === 'number' ? b.difficulty : 
                       (b.difficulty === 'hard' ? 3 : (b.difficulty === 'medium' ? 2 : 1));
    
    return difficultyB - difficultyA;
  });
}

/**
 * Calcula los puntos de la curva de olvido para un periodo futuro
 */
export function calculateForgettingCurve(
  card: FlashcardWithSpacedRepetition, 
  days: number = 30,
  pointsCount: number = 10
): Array<{date: Date, retention: number}> {
  const now = new Date();
  const points: Array<{date: Date, retention: number}> = [];
  
  // Memoria inicial (en el momento actual)
  const initialRetention = calculateRetentionProbability(card);
  points.push({ date: new Date(now), retention: initialRetention });
  
  // Fuerza de la memoria (basada en intervalo y factor de facilidad)
  const memoryStrength = card.spacedRepetition.interval * card.spacedRepetition.easeFactor;
  
  // Generar puntos para la curva
  const interval = days / (pointsCount - 1);
  
  for (let i = 1; i < pointsCount; i++) {
    const futureDate = new Date(now);
    const daysInFuture = interval * i;
    futureDate.setDate(futureDate.getDate() + daysInFuture);
    
    // Aplicar fórmula de olvido de Ebbinghaus
    let retention = initialRetention * Math.exp(-daysInFuture / (memoryStrength || 1));
    retention = Math.max(0, Math.min(1, retention));
    
    points.push({ date: futureDate, retention });
  }
  
  return points;
} 