import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useRouter, useSegments } from 'expo-router';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Protected Routes Logic
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'onboarding';
    const inPublicGroup = segments[0] === 'login' || segments[0] === 'phone-verify' || segments[0] === 'auth';

    if (!session && inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (session) {
        // Check if user has a profile
        const checkProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('id', session.user.id)
                    .single();
                
                // If we are in a public group (like login/auth), we need to decide where to go
                if (inPublicGroup) {
                    if (data) {
                        // Profile exists -> Go to Tabs
                        router.replace('/(tabs)');
                    } else {
                        // No profile -> Go to Onboarding
                        router.replace('/onboarding/name');
                    }
                } else if (segments[0] === 'onboarding' && data) {
                    // If user is in onboarding but HAS a profile, send them to tabs
                    router.replace('/(tabs)');
                }
            } catch (e) {
                console.error("Profile check error:", e);
            }
        };
        checkProfile();
    }
  }, [session, loading, segments]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
