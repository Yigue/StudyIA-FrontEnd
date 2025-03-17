// import { supabase } from './supabase';

interface AnalysisResult {
  summary: string;
  flashcards: Array<{
    question: string;
    answer: string;
  }>;
}

// Datos de ejemplo mejorados para simular la respuesta de la IA
const mockAnalysis = (content: string): AnalysisResult => {
  const topics = [
    "Historia",
    "Ciencia",
    "Matemáticas",
    "Literatura",
    "Tecnología",
    "Arte",
    "Filosofía",
  ];

  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const wordCount = content.split(/\s+/).length;

  return {
    summary: `Este texto de ${wordCount} palabras aborda temas importantes de ${randomTopic}. 
    
Los puntos principales incluyen conceptos fundamentales, aplicaciones prácticas y ejemplos detallados que ayudan a comprender mejor la materia. El contenido está estructurado de manera lógica, facilitando el aprendizaje progresivo.

Se destacan las siguientes ideas clave:
1. Fundamentos teóricos y su evolución histórica
2. Aplicaciones prácticas en contextos reales
3. Metodologías y técnicas específicas
4. Casos de estudio y ejemplos ilustrativos`,
    flashcards: [
      {
        question: `¿Cuáles son los principios fundamentales de ${randomTopic}?`,
        answer:
          "Los principios fundamentales incluyen la base teórica, metodología de estudio y aplicaciones prácticas.",
      },
      {
        question: "¿Qué metodologías se utilizan para el análisis?",
        answer:
          "Se utilizan métodos analíticos, comparativos y experimentales para obtener resultados precisos y verificables.",
      },
      {
        question: "¿Cómo se aplican estos conceptos en la práctica?",
        answer:
          "Los conceptos se aplican mediante casos de estudio, ejercicios prácticos y proyectos del mundo real que demuestran su utilidad.",
      },
      {
        question: "¿Qué herramientas o recursos son necesarios?",
        answer:
          "Se requieren herramientas específicas del campo, recursos digitales y materiales de referencia actualizados.",
      },
      {
        question: "¿Cuáles son las tendencias actuales en este campo?",
        answer:
          "Las tendencias incluyen innovaciones tecnológicas, nuevos métodos de investigación y enfoques interdisciplinarios.",
      },
      {
        question: "¿Qué desafíos presenta el tema y cómo abordarlos?",
        answer:
          "Los principales desafíos incluyen la complejidad conceptual y la aplicación práctica, que se abordan mediante estudio sistemático y práctica constante.",
      },
    ],
  };
};

export async function analyzeContent(content: string): Promise<AnalysisResult> {
  try {
    if (!content || typeof content !== "string") {
      throw new Error("El contenido es inválido o está vacío");
    }
    if (content.trim().length < 10) {
      throw new Error("El contenido es demasiado corto para ser analizado");
    }

    // Simulamos un retraso variable para hacer la experiencia más realista
    const delay = Math.floor(Math.random() * 2000) + 1000; // 1-3 segundos
    await new Promise((resolve) => setTimeout(resolve, delay));

    return mockAnalysis(content);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido en el análisis";
    throw new Error(errorMessage);
  }
}
