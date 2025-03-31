import { Params } from "../api";
import { Flashcard } from "../flashcards/flashcards";
import { Summary } from "../summary/summary";
import { Tag } from "../tag/tag";
import {
  CreateMaterialDTO,
  CreateOptions,
  ProcessOptions,
} from "./studyMaterialRequest";

export interface StudyMaterial {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  content: string | null;
  userId: string; // UUID del creador
  processingStatus?: "pending" | "completed" | "failed";
  tags: Tag[];
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface MaterialActions {
  fetchMaterials: (params?:Params) => Promise<void>;
  getMaterialById: (id: string) => Promise<void>;
  createMaterial: (
    material: CreateMaterialDTO,
    options: CreateOptions
  ) => Promise<StudyMaterial | null>;
  processMaterial: (
    material: StudyMaterial,
    options: ProcessOptions
  ) => Promise<{ summary: Summary | null; flashcards: Flashcard[] | null }>;

  deleteMaterial: (id: string) => Promise<void>;
  setCurrentMaterial: (id: StudyMaterial) => void;
  clearError: () => void;
}
