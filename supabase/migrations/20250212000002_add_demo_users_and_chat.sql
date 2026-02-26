/*
  # Add Demo Users, Chat Tables, and Profile Enhancements
  
  ## Query Description:
  This migration adds necessary columns to the profiles table, creates matches and messages tables for the chat feature, and seeds 6 demo users into the database.
  
  ## Metadata:
  - Schema-Category: "Structural & Data"
  - Impact-Level: "Medium"
  - Requires-Backup: false
  - Reversible: true
*/

-- 1. Enhance Profiles Table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job TEXT;

-- 2. Create Swipes Table (if not exists)
CREATE TABLE IF NOT EXISTS public.swipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    liker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(liker_id, target_id)
);

-- 3. Create Matches Table
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user1_id, user2_id)
);

-- 4. Create Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable RLS
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own swipes" ON public.swipes FOR INSERT WITH CHECK (auth.uid() = liker_id);
CREATE POLICY "Users can view their own swipes" ON public.swipes FOR SELECT USING (auth.uid() = liker_id OR auth.uid() = target_id);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own matches" ON public.matches FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can insert matches" ON public.matches FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages of their matches" ON public.messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.matches WHERE id = match_id AND (user1_id = auth.uid() OR user2_id = auth.uid()))
);
CREATE POLICY "Users can insert messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- 6. Seed Demo Users (Create auth.users first, then profiles)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'priya@demo.com', 'hashed', now(), now(), now()),
('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'aanya@demo.com', 'hashed', now(), now(), now()),
('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'riya@demo.com', 'hashed', now(), now(), now()),
('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'sneha@demo.com', 'hashed', now(), now(), now()),
('00000000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555', 'authenticated', 'authenticated', 'kavya@demo.com', 'hashed', now(), now(), now()),
('00000000-0000-0000-0000-000000000000', '66666666-6666-6666-6666-666666666666', 'authenticated', 'authenticated', 'meera@demo.com', 'hashed', now(), now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, first_name, birth_date, city, bio, interests, photos, is_demo, onboarding_complete, gender, interested_in)
VALUES
('11111111-1111-1111-1111-111111111111', 'Priya Sharma', '1998-01-01', 'Bangalore', 'Coffee addict, solo traveler, and startup junkie. Swipe right if you love mountains.', ARRAY['Travel', 'Coffee', 'Hiking'], ARRAY['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800'], true, true, 'Woman', 'Everyone'),
('22222222-2222-2222-2222-222222222222', 'Aanya Mehta', '2000-01-01', 'Mumbai', 'Bookworm by day, dancer by night. Looking for someone to debate Murakami with.', ARRAY['Books', 'Dance', 'Art'], ARRAY['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800'], true, true, 'Woman', 'Everyone'),
('33333333-3333-3333-3333-333333333333', 'Riya Nair', '1996-01-01', 'Bangalore', 'UX designer who actually talks to users. Dog mom. Brunch enthusiast.', ARRAY['Design', 'Dogs', 'Food'], ARRAY['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800'], true, true, 'Woman', 'Everyone'),
('44444444-4444-4444-4444-444444444444', 'Sneha Kapoor', '1999-01-01', 'Delhi', 'Lawyer by profession, comedian by accident. Will argue both sides of any debate.', ARRAY['Law', 'Comedy', 'Politics'], ARRAY['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800'], true, true, 'Woman', 'Everyone'),
('55555555-5555-5555-5555-555555555555', 'Kavya Reddy', '1997-01-01', 'Hyderabad', 'Musician and terrible chef. Looking for someone patient enough to eat my experiments.', ARRAY['Music', 'Cooking', 'Films'], ARRAY['https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800'], true, true, 'Woman', 'Everyone'),
('66666666-6666-6666-6666-666666666666', 'Meera Joshi', '2001-01-01', 'Pune', 'PhD student in astrophysics who still can''t parallel park. Stars > people usually.', ARRAY['Science', 'Astronomy', 'Yoga'], ARRAY['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'], true, true, 'Woman', 'Everyone')
ON CONFLICT (id) DO UPDATE SET is_demo = true, onboarding_complete = true;
