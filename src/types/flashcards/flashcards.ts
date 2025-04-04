import { Tag } from "../tag/tag";

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  tags: Tag[];
  active: boolean;
  type: TagType;
  material_id: string; // UUID del material
  next_review: string | null; // ISO 8601
  last_reviewed: string | null; // ISO 86017
  interval: number;
  repetitions: number;
  ease_factor: number;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601

}


export enum TagType {
  Text = "text",
  Image = "image",
  Audio = "audio",
  Video = "video",
  Document = "document",
  Link = "link",
  Other = "other",
}


