export interface StudyMaterial {
  id: string;
  user_id: string;
  subject_id: string;
  title: string;
  content: string;
  summary: string | null;
  file_url: string | null;
  tags: string[];
  created_at: Date;
  updated_at: Date;

}
