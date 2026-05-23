import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  avatar_url: string | null;
  total_rides: number;
  created_at: string;
};

export type Driver = {
  id: string;
  name: string;
  phone: string;
  vehicle_number: string;
  rating: number;
  total_trips: number;
  is_available: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

export type Ride = {
  id: string;
  user_id: string;
  driver_id: string | null;
  pickup_address: string;
  dropoff_address: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  fare: number | null;
  distance_km: number | null;
  duration_min: number | null;
  rating: number | null;
  created_at: string;
  completed_at: string | null;
  driver?: Driver;
};
