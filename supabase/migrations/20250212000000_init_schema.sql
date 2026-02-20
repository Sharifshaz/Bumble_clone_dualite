/*
  # Initial Schema Setup

  ## Query Description:
  Sets up the core tables for the dating app: profiles, swipes, matches, and messages.
  Also seeds the database with some initial dummy profiles so the app isn't empty.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "High"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - public.profiles: User details (linked to auth.users)
  - public.swipes: Tracks likes/passes
  - public.matches: Pairs of users who liked each other
  - public.messages: Chat messages between matches
*/

-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key, -- Maps to auth.users.id OR random uuid for fake users
  first_name text,
  birth_date date,
  gender text,
  interested_in text[],
  photos text[],
  bio text,
  job text,
  interests text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Swipes table
create table if not exists public.swipes (
  id uuid default gen_random_uuid() primary key,
  liker_id uuid references public.profiles(id) on delete cascade not null,
  target_id uuid references public.profiles(id) on delete cascade not null,
  action text check (action in ('like', 'pass')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(liker_id, target_id)
);

alter table public.swipes enable row level security;

create policy "Users can insert their own swipes"
  on public.swipes for insert
  with check ( auth.uid() = liker_id );

create policy "Users can view their own swipes"
  on public.swipes for select
  using ( auth.uid() = liker_id );

-- Matches table
create table if not exists public.matches (
  id uuid default gen_random_uuid() primary key,
  user1_id uuid references public.profiles(id) on delete cascade not null,
  user2_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user1_id, user2_id)
);

alter table public.matches enable row level security;

create policy "Users can view their matches"
  on public.matches for select
  using ( auth.uid() = user1_id or auth.uid() = user2_id );

-- Messages table
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references public.matches(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.messages enable row level security;

create policy "Users can view messages in their matches"
  on public.messages for select
  using (
    exists (
      select 1 from public.matches m
      where m.id = match_id
      and (m.user1_id = auth.uid() or m.user2_id = auth.uid())
    )
  );

create policy "Users can insert messages in their matches"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.matches m
      where m.id = match_id
      and (m.user1_id = auth.uid() or m.user2_id = auth.uid())
    )
  );

-- SEED DATA (Fake Profiles)
insert into public.profiles (id, first_name, birth_date, gender, interested_in, photos, bio, job, interests)
values 
  (gen_random_uuid(), 'Sarah', '1999-05-15', 'Woman', ARRAY['Men'], ARRAY['https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000'], 'Adventure seeker and coffee enthusiast. ☕️', 'Graphic Designer', ARRAY['Coffee', 'Design', 'Travel']),
  (gen_random_uuid(), 'Jessica', '1995-08-20', 'Woman', ARRAY['Men'], ARRAY['https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000'], 'Marketing manager by day, aspiring chef by night. 🍝', 'Marketing Manager', ARRAY['Cooking', 'Marketing', 'Yoga']),
  (gen_random_uuid(), 'Michael', '1993-02-10', 'Man', ARRAY['Women'], ARRAY['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000'], 'Software Engineer. I speak Python and Sarcasm.', 'Software Engineer', ARRAY['Coding', 'Gaming', 'Sci-Fi']),
  (gen_random_uuid(), 'David', '1994-11-30', 'Man', ARRAY['Women'], ARRAY['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000'], 'Entrepreneur. Building the next big thing.', 'Founder', ARRAY['Business', 'Startups', 'Gym']),
  (gen_random_uuid(), 'Olivia', '1998-04-05', 'Woman', ARRAY['Men'], ARRAY['https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000'], 'Art lover and gallery hopper.', 'Curator', ARRAY['Art', 'Museums', 'Wine']),
  (gen_random_uuid(), 'Daniel', '1991-09-12', 'Man', ARRAY['Women'], ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000'], 'Just moved here. Show me around?', 'Architect', ARRAY['Architecture', 'Travel', 'Photography']),
  (gen_random_uuid(), 'Sophia', '2000-01-25', 'Woman', ARRAY['Men'], ARRAY['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000'], 'Student of life.', 'Student', ARRAY['Books', 'Learning', 'Music']),
  (gen_random_uuid(), 'James', '1996-06-18', 'Man', ARRAY['Women'], ARRAY['https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1000'], 'Musician. Let’s jam.', 'Musician', ARRAY['Music', 'Guitar', 'Concerts']);
