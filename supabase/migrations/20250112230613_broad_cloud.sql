/*
  # Study System Database Schema

  1. New Tables
    - `subjects`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `study_materials`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `summary` (text)
      - `subject_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `flashcards`
      - `id` (uuid, primary key)
      - `question` (text)
      - `answer` (text)
      - `material_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create subjects table
CREATE TABLE subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own subjects"
  ON subjects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create study_materials table
CREATE TABLE study_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  summary text,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own study materials"
  ON study_materials
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create flashcards table
CREATE TABLE flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  material_id uuid REFERENCES study_materials(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own flashcards"
  ON flashcards
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);