import { Tag } from "../tag/tag";

export interface StudyMaterialDTO {
  title: string;
  content?: string;
  file?:File
  summary: string;
  type: "text"|"file";
  tags?: Tag[];

}
