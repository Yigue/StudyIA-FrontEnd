// Datos de ejemplo para la aplicación
export const mockSubjects = [
  { id: '1', name: 'Matemáticas' },
  { id: '2', name: 'Historia' },
  { id: '3', name: 'Ciencias' },
  { id: '4', name: 'Literatura' },
  { id: '5', name: 'Programación' }
];

export const mockFlashcards = [
  {
    id: '1',
    question: '¿Qué es el teorema de Pitágoras?',
    answer: 'En un triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos.',
    difficulty: 3,
    next_review: new Date(Date.now() + 86400000).toISOString(),
    material_id: '1',
    material: {
      title: 'Geometría Básica',
      subject: { name: 'Matemáticas' }
    }
  },
  {
    id: '2',
    question: '¿Cuándo comenzó la Segunda Guerra Mundial?',
    answer: 'La Segunda Guerra Mundial comenzó el 1 de septiembre de 1939 con la invasión de Polonia por la Alemania nazi.',
    difficulty: 2,
    next_review: new Date(Date.now() + 172800000).toISOString(),
    material_id: '2',
    material: {
      title: 'Segunda Guerra Mundial',
      subject: { name: 'Historia' }
    }
  },
  {
    id: '3',
    question: '¿Qué es la fotosíntesis?',
    answer: 'Proceso por el cual las plantas convierten la luz solar en energía química, produciendo glucosa y oxígeno a partir de dióxido de carbono y agua.',
    difficulty: 4,
    next_review: new Date(Date.now() + 43200000).toISOString(),
    material_id: '3',
    material: {
      title: 'Procesos Biológicos',
      subject: { name: 'Ciencias' }
    }
  },
  {
    id: '4',
    question: '¿Quién escribió "Cien años de soledad"?',
    answer: 'Gabriel García Márquez escribió "Cien años de soledad", publicada en 1967.',
    difficulty: 1,
    next_review: new Date(Date.now() + 259200000).toISOString(),
    material_id: '4',
    material: {
      title: 'Literatura Latinoamericana',
      subject: { name: 'Literatura' }
    }
  },
  {
    id: '5',
    question: '¿Qué es una variable en programación?',
    answer: 'Una variable es un espacio en memoria que almacena un valor que puede cambiar durante la ejecución del programa.',
    difficulty: 3,
    next_review: new Date(Date.now()).toISOString(),
    material_id: '5',
    material: {
      title: 'Fundamentos de Programación',
      subject: { name: 'Programación' }
    }
  }
];