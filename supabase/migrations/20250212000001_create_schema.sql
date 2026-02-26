/*
# Initial Schema Setup
Creates profiles, swipes, and matches tables for the dating app.

## Query Description:
This operation sets up the core tables required for the application to function, including user profiles, swipe tracking, and match recording. It also establishes Row Level Security (RLS) policies to ensure users can only access and modify their own data appropriately.

## Metadata:
- Schema-Category: Structural
- Impact-Level: Low
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Creates `profiles` table linked to `auth.users`.
- Creates `swipes` table to track likes/passes.
- Creates `matches` table to track mutual likes.

## Security Implications:
- RLS Status: Enabled on all tables.
- Policy Changes: Yes (Insert/Select/Update policies for respective tables).
- Auth Requirements: Requires authenticated users for most operations.
*/

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  first_name text,
  birth_date timestamp with time zone,
  gender text,
  interested_in text[],
  photos text[],
  interests text[],
  bio text,
  job text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create swipes table
create table if not exists public.swipes (
  id uuid default gen_random_uuid() primary key,
  liker_id uuid references public.profiles(id) not null,
  target_id uuid references public.profiles(id) not null,
  action text not null check (action in ('like', 'pass')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(liker_id, target_id)
);

-- Create matches table
create table if not exists public.matches (
  id uuid default gen_random_uuid() primary key,
  user1_id uuid references public.profiles(id) not null,
  user2_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user1_id, user2_id)
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.swipes enable row level security;
alter table public.matches enable row level security;

-- Profiles policies
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- Swipes policies
create policy "Users can view their own swipes" on public.swipes for select using (auth.uid() = liker_id);
create policy "Users can insert their own swipes" on public.swipes for insert with check (auth.uid() = liker_id);

-- Matches policies
create policy "Users can view their own matches" on public.matches for select using (auth.uid() = user1_id or auth.uid() = user2_id);
create policy "System can insert matches" on public.matches for insert with check (auth.uid() = user1_id or auth.uid() = user2_id);
