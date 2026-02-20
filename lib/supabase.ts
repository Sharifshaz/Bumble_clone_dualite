import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Fallback to direct values if process.env fails in the container
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ktmmfhsbktwdnhaeyekl.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0bW1maHNia3R3ZG5oYWV5ZWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTM5ODAsImV4cCI6MjA4NjQ4OTk4MH0.4m5SOUI137YhofbNzYsE8eg25ffG6K5Bl13eGFOFDEo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
