
/*
  # E-Rickshaw Booking System - Initial Schema

  1. New Tables
    - `profiles` — Extended user profile data linked to auth.users
      - `id` (uuid, PK, references auth.users)
      - `full_name` (text)
      - `phone` (text)
      - `avatar_url` (text, nullable)
      - `total_rides` (int, default 0)
      - `created_at` (timestamptz)

    - `drivers` — Driver profiles and vehicle info
      - `id` (uuid, PK)
      - `name` (text)
      - `phone` (text)
      - `vehicle_number` (text)
      - `rating` (numeric, default 4.5)
      - `total_trips` (int, default 0)
      - `is_available` (bool, default true)
      - `latitude` (numeric, nullable)
      - `longitude` (numeric, nullable)
      - `created_at` (timestamptz)

    - `rides` — Ride bookings
      - `id` (uuid, PK)
      - `user_id` (uuid, references profiles)
      - `driver_id` (uuid, references drivers, nullable)
      - `pickup_address` (text)
      - `dropoff_address` (text)
      - `status` (text: pending | accepted | in_progress | completed | cancelled)
      - `fare` (numeric, nullable)
      - `distance_km` (numeric, nullable)
      - `duration_min` (int, nullable)
      - `rating` (int, nullable 1-5)
      - `created_at` (timestamptz)
      - `completed_at` (timestamptz, nullable)

  2. Security
    - RLS enabled on all tables
    - Users can only read/update their own profile
    - Users can read drivers (public info for booking)
    - Users can only create/view/update their own rides
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  avatar_url text,
  total_rides int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL DEFAULT '',
  vehicle_number text NOT NULL DEFAULT '',
  rating numeric NOT NULL DEFAULT 4.5,
  total_trips int NOT NULL DEFAULT 0,
  is_available boolean NOT NULL DEFAULT true,
  latitude numeric,
  longitude numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view drivers"
  ON drivers FOR SELECT
  TO authenticated
  USING (true);

-- Rides table
CREATE TABLE IF NOT EXISTS rides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  driver_id uuid REFERENCES drivers(id),
  pickup_address text NOT NULL DEFAULT '',
  dropoff_address text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','in_progress','completed','cancelled')),
  fare numeric,
  distance_km numeric,
  duration_min int,
  rating int CHECK (rating BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rides"
  ON rides FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rides"
  ON rides FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rides"
  ON rides FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Seed some sample drivers
INSERT INTO drivers (name, phone, vehicle_number, rating, total_trips, is_available) VALUES
  ('Rajan Kumar', '+91 98765 43210', 'DL-E-1234', 4.8, 342, true),
  ('Mohan Singh', '+91 91234 56789', 'DL-E-5678', 4.6, 218, true),
  ('Priya Sharma', '+91 87654 32109', 'DL-E-9012', 4.9, 521, true),
  ('Arjun Patel', '+91 76543 21098', 'DL-E-3456', 4.5, 167, false),
  ('Sunita Devi', '+91 65432 10987', 'DL-E-7890', 4.7, 289, true)
ON CONFLICT DO NOTHING;
