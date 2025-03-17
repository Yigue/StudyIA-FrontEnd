/*
  # Agregar sistema de repaso espaciado a flashcards

  1. Cambios
    - Agregar columna `difficulty` para almacenar el nivel de dificultad (1-5)
    - Agregar columna `next_review` para programar la próxima revisión
    - Establecer valores por defecto:
      - difficulty: 3 (dificultad normal)
      - next_review: fecha actual (para que aparezca inmediatamente para revisión)

  2. Notas
    - La dificultad afecta el intervalo de repaso:
      - 1 (Muy Fácil): 1 día
      - 2 (Fácil): 2 días
      - 3 (Normal): 4 días
      - 4 (Difícil): 8 días
      - 5 (Muy Difícil): 16 días
*/

DO $$ 
BEGIN
  -- Agregar columna difficulty si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'flashcards' AND column_name = 'difficulty'
  ) THEN
    ALTER TABLE flashcards ADD COLUMN difficulty integer DEFAULT 3;
  END IF;

  -- Agregar columna next_review si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'flashcards' AND column_name = 'next_review'
  ) THEN
    ALTER TABLE flashcards ADD COLUMN next_review timestamptz DEFAULT now();
  END IF;
END $$;