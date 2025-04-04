import { Tag } from "../tag/tag";

// Para crear material de texto
export interface CreateMaterialDTO {
  title: string;
  description?: string;
  file?: File;
  content?: string;
  tags?: string[]; 
  type:"file"|"text";
}
export interface CreateOptions{
  type: "text" | "file";

}
// ----------------------------------------------------------
export interface TextMaterialDTO {
  title: string;
  description?: string;
  content: string;
  tags?: string[]; 
  type:"file"|"text";
}


export interface FileMaterialDTO {
  title: string;
  description?: string;
  file: File;
  type:"file"|"text";
  tags?: string[]; // Array de IDs de etiquetas
}

// Para procesar material completo
export interface ProcessMaterialDTO {
  title: string;
  description?: string;
  file: File;
  tags?: string[];
  generate_summary?: boolean;
  generate_flashcards?: boolean;
  summary_format?: "bullet_points" | "paragraph" | "structured";
  summary_length?: "short" | "medium" | "long";
  flashcards_count?: number;
  flashcards_difficulty?: "easy" | "medium" | "hard";
}
export interface ProcessOptions{
  generate_summary?: boolean;
  generate_flashcards?: boolean;
  summary_options?: GenerateSummaryDTO;
  flashcards_options?: GenerateFlashcardsDTO;
} 

export interface GenerateSummaryDTO {
  tags?: Tag[];
  options?: {
    format?: "bullet_points" | "paragraph" | "structured";
    length?: "short" | "medium" | "long";
    complexity?: "easy" | "medium" | "hard";
  }
}

// Para generar flashcards para un material
export interface GenerateFlashcardsDTO {
  tags?: Tag[];
  options?: {
    count?: number;
    difficulty?: "easy" | "medium" | "hard";
  }
}
