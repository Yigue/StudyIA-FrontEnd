import { Params } from "../api";
import { Flashcard, Summary, StudyMaterial } from "@/types";
import {
  CreateMaterialDTO,
  CreateOptions,
  ProcessOptions,
} from "./studyMaterialRequest";

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
  setCurrentMaterial: (material: StudyMaterial) => void;
  clearError: () => void;
}
