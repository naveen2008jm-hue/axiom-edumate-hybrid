-- =========================================================
-- AXIOM CAREER ARCHITECT — UNIFIED SUPABASE DATABASE SCHEMA
-- =========================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles & Gamification Engine
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  email text,
  avatar_url text,
  college text,
  branch text,
  graduation_year int,
  github_username text,
  leetcode_username text,
  target_role text DEFAULT 'Software Development Engineer',
  target_companies text[] DEFAULT ARRAY['Google', 'Microsoft', 'Atlassian', 'Amazon'],
  bio text,
  current_streak int DEFAULT 0,
  longest_streak int DEFAULT 0,
  last_activity_at timestamptz DEFAULT now(),
  xp_points int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Axiom Omni-Skill Curriculums
CREATE TABLE IF NOT EXISTS omni_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  topic_name text NOT NULL,
  category text CHECK (category IN ('Physical', 'Conceptual')),
  title text NOT NULL,
  summary text,
  days jsonb NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 3. Curated 75+ DSA Problem Tracker
CREATE TABLE IF NOT EXISTS dsa_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  category text NOT NULL,
  title text NOT NULL,
  difficulty text CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  leetcode_slug text,
  leetcode_url text,
  key_pattern text,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 4. Job & Internship Applications Pipeline
CREATE TABLE IF NOT EXISTS internships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  company_name text NOT NULL,
  role_title text NOT NULL,
  location text,
  stipend_or_ctc text,
  application_date date,
  deadline date,
  duration text,
  status text NOT NULL DEFAULT 'Applied',
  rounds_info jsonb DEFAULT '[]'::jsonb,
  notes text,
  job_link text,
  created_at timestamptz DEFAULT now()
);

-- 5. Engineering Project Portfolio
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  title text NOT NULL,
  short_description text,
  tech_stack text[],
  github_repo_url text,
  live_demo_url text,
  highlights text[],
  stars_count int DEFAULT 0,
  status text DEFAULT 'Completed',
  created_at timestamptz DEFAULT now()
);

-- 6. Interview Mistakes & Anti-Patterns Log
CREATE TABLE IF NOT EXISTS mistake_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  log_date date DEFAULT CURRENT_DATE,
  context_or_company text NOT NULL,
  mistake_description text NOT NULL,
  lesson_learned text NOT NULL,
  tags text[],
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 7. Focus & Study Sessions
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  category text NOT NULL,
  topic_name text,
  duration_minutes int NOT NULL,
  session_date date DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 8. PostgreSQL Streak Update Function (+10 XP)
CREATE OR REPLACE FUNCTION update_user_streak(user_uuid uuid)
RETURNS void AS $$
DECLARE
  v_last_activity timestamptz;
  v_current_streak int;
  v_longest_streak int;
  v_diff_hours numeric;
BEGIN
  SELECT last_activity_at, current_streak, longest_streak
  INTO v_last_activity, v_current_streak, v_longest_streak
  FROM profiles
  WHERE id = user_uuid;

  IF v_last_activity IS NULL THEN
    v_current_streak := 1;
  ELSE
    v_diff_hours := EXTRACT(EPOCH FROM (now() - v_last_activity)) / 3600;
    IF v_diff_hours < 12 THEN
      -- Activity within 12h: retain streak
    ELSIF v_diff_hours BETWEEN 12 AND 48 THEN
      v_current_streak := v_current_streak + 1;
    ELSE
      -- More than 48h: reset
      v_current_streak := 1;
    END IF;
  END IF;

  IF v_current_streak > v_longest_streak THEN
    v_longest_streak := v_current_streak;
  END IF;

  UPDATE profiles
  SET current_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_activity_at = now(),
      xp_points = COALESCE(xp_points, 0) + 10,
      updated_at = now()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
