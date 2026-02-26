/*
  # Setup Schema and Seed Demo Users
  
  ## Query Description:
  Creates necessary tables (profiles, swipes, matches, messages) if they don't exist.
  Adds required columns for the Bumble clone features.
  Seeds 6 demo users into the profiles table so they appear in the swipe deck.
  
  ## Metadata:
  - Schema-Category: "Structural & Data"
  - Impact-Level: "Medium"
  - Requires-Backup: false
  - Reversible: true
*/

-- 1. Create Profiles Table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users not null primary key,
  first_name text,
  birth_date timestamp with time zone,
  gender text,
  interested_in text[],
  photos text[],
  interests text[],
  city text,
  bio text,
  is_demo boolean default false,
  onboarding_complete boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add missing columns if table already existed but lacked them
DO $$ 
BEGIN
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN city text;
  EXCEPTION WHEN duplicate_column THEN END;
  
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN bio text;
  EXCEPTION WHEN duplicate_column THEN END;
  
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN is_demo boolean default false;
  EXCEPTION WHEN duplicate_column THEN END;
  
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN onboarding_complete boolean default false;
  EXCEPTION WHEN duplicate_column THEN END;
  
  BEGIN
    ALTER TABLE public.profiles ADD COLUMN interested_in text[];
  EXCEPTION WHEN duplicate_column THEN END;
END $$;

-- 2. Create Swipes Table
CREATE TABLE IF NOT EXISTS public.swipes (
  id uuid default gen_random_uuid() primary key,
  liker_id uuid references public.profiles(id) not null,
  target_id uuid references public.profiles(id) not null,
  action text not null check (action in ('like', 'pass')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(liker_id, target_id)
);

-- 3. Create Matches Table
CREATE TABLE IF NOT EXISTS public.matches (
  id uuid default gen_random_uuid() primary key,
  user1_id uuid references public.profiles(id) not null,
  user2_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user1_id, user2_id)
);

-- 4. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references public.matches(id) not null,
  sender_id uuid references public.profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies (Safe defaults)
DO $$ BEGIN
  CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR is_demo = true);
EXCEPTION WHEN duplicate_object THEN END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view their own swipes" ON public.swipes FOR SELECT USING (auth.uid() = liker_id OR auth.uid() = target_id);
EXCEPTION WHEN duplicate_object THEN END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert their own swipes" ON public.swipes FOR INSERT WITH CHECK (auth.uid() = liker_id);
EXCEPTION WHEN duplicate_object THEN END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view their own matches" ON public.matches FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
EXCEPTION WHEN duplicate_object THEN END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert matches" ON public.matches FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);
EXCEPTION WHEN duplicate_object THEN END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view messages of their matches" ON public.messages FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.matches m 
      WHERE m.id = match_id AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
    )
  );
EXCEPTION WHEN duplicate_object THEN END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert messages to their matches" ON public.messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.matches m 
      WHERE m.id = match_id AND (m.user1_id = auth.uid() OR m.user2_id = auth.uid())
    )
  );
EXCEPTION WHEN duplicate_object THEN END $$;

-- 7. Seed Demo Users
-- Insert into auth.users first to satisfy the foreign key constraint safely
DO $$
DECLARE
  demo_users uuid[] := ARRAY[
    '11111111-1111-1111-1111-111111111111'::uuid,
    '22222222-2222-2222-2222-222222222222'::uuid,
    '33333333-3333-3333-3333-333333333333'::uuid,
    '44444444-4444-4444-4444-444444444444'::uuid,
    '55555555-5555-5555-5555-555555555555'::uuid,
    '66666666-6666-6666-6666-666666666666'::uuid
  ];
  emails text[] := ARRAY[
    'priya@demo.com', 'aanya@demo.com', 'riya@demo.com', 
    'sneha@demo.com', 'kavya@demo.com', 'meera@demo.com'
  ];
  i integer;
BEGIN
  FOR i IN 1..6 LOOP
    BEGIN
      INSERT INTO auth.users (id, email, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
      VALUES (
        demo_users[i], 
        emails[i], 
        '{"provider":"email","providers":["email"]}', 
        '{}', 
        'authenticated', 
        'authenticated', 
        now(), 
        now()
      );
    EXCEPTION WHEN unique_violation THEN
      -- Ignore if user already exists
    END;
  END LOOP;
END $$;

-- Insert into profiles
INSERT INTO public.profiles (id, first_name, birth_date, city, bio, interests, photos, is_demo, onboarding_complete)
VALUES 
  (
    '11111111-1111-1111-1111-111111111111', 
    'Priya Sharma', 
    '1998-01-01'::timestamp, 
    'Bangalore', 
    'Coffee addict, solo traveler, and startup junkie. Swipe right if you love mountains.', 
    ARRAY['Travel', 'Coffee', 'Hiking'], 
    ARRAY['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800'], 
    true, 
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222', 
    'Aanya Mehta', 
    '2000-01-01'::timestamp, 
    'Mumbai', 
    'Bookworm by day, dancer by night. Looking for someone to debate Murakami with.', 
    ARRAY['Books', 'Dance', 'Art'], 
    ARRAY['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800'], 
    true, 
    true
  ),
  (
    '33333333-3333-3333-3333-333333333333', 
    'Riya Nair', 
    '1996-01-01'::timestamp, 
    'Bangalore', 
    'UX designer who actually talks to users. Dog mom. Brunch enthusiast.', 
    ARRAY['Design', 'Dogs', 'Food'], 
    ARRAY['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800'], 
    true, 
    true
  ),
  (
    '44444444-4444-4444-4444-444444444444', 
    'Sneha Kapoor', 
    '1999-01-01'::timestamp, 
    'Delhi', 
    'Lawyer by profession, comedian by accident. Will argue both sides of any debate.', 
    ARRAY['Law', 'Comedy', 'Politics'], 
    ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800'], 
    true, 
    true
  ),
  (
    '55555555-5555-5555-5555-555555555555', 
    'Kavya Reddy', 
    '1997-01-01'::timestamp, 
    'Hyderabad', 
    'Musician and terrible chef. Looking for someone patient enough to eat my experiments.', 
    ARRAY['Music', 'Cooking', 'Films'], 
    ARRAY['https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800'], 
    true, 
    true
  ),
  (
    '66666666-6666-6666-6666-666666666666', 
    'Meera Joshi', 
    '2001-01-01'::timestamp, 
    'Pune', 
    'PhD student in astrophysics who still can''t parallel park. Stars > people usually.', 
    ARRAY['Science', 'Astronomy', 'Yoga'], 
    ARRAY['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'], 
    true, 
    true
  )
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  bio = EXCLUDED.bio,
  city = EXCLUDED.city,
  interests = EXCLUDED.interests,
  photos = EXCLUDED.photos,
  is_demo = true,
  onboarding_complete = true;
