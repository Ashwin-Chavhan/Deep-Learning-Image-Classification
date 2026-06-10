/*
  # Image Classification System Schema

  1. New Tables
    - `classifications`
      - `id` (uuid, primary key) - Unique identifier for each classification
      - `user_id` (uuid, foreign key) - Reference to auth.users
      - `image_url` (text) - URL or data URI of the classified image
      - `predictions` (jsonb) - Array of predictions with class names and confidence scores
      - `top_prediction` (text) - The highest confidence prediction
      - `confidence` (numeric) - Confidence score of top prediction (0-100)
      - `created_at` (timestamptz) - Timestamp of classification

  2. Security
    - Enable RLS on `classifications` table
    - Policy: Users can insert their own classifications
    - Policy: Users can view only their own classifications
    - Policy: Users can delete their own classifications
    
  3. Important Notes
    - All classification data is user-scoped for privacy
    - JSONB is used for flexible prediction storage
    - Indexes added for performance on user queries
*/

-- Create classifications table
CREATE TABLE IF NOT EXISTS classifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  predictions jsonb NOT NULL DEFAULT '[]'::jsonb,
  top_prediction text NOT NULL,
  confidence numeric(5,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster user queries
CREATE INDEX IF NOT EXISTS idx_classifications_user_id ON classifications(user_id);
CREATE INDEX IF NOT EXISTS idx_classifications_created_at ON classifications(created_at DESC);

-- Enable Row Level Security
ALTER TABLE classifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own classifications
CREATE POLICY "Users can create own classifications"
  ON classifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own classifications
CREATE POLICY "Users can view own classifications"
  ON classifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own classifications
CREATE POLICY "Users can delete own classifications"
  ON classifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);