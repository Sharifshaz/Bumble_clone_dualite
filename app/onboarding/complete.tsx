import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Hexagon, PartyPopper, AlertCircle } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { BumbleButton } from '../../components/BumbleButton';

export default function CompleteScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const { user } = useAuth();
  const scale = useSharedValue(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(true);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10 });
    
    const saveProfile = async () => {
        if (!user) return;

        if (!data.firstName) {
            router.replace('/onboarding/name');
            return;
        }

        try {
            // FIX 2: Set onboarding_complete to true
            const { error: upsertError } = await supabase.from('profiles').upsert({
                id: user.id,
                first_name: data.firstName,
                birth_date: data.birthDate ? data.birthDate.toISOString() : new Date().toISOString(),
                gender: data.gender,
                interested_in: data.interestedIn,
                photos: data.photos,
                interests: data.interests,
                onboarding_complete: true,
            });

            if (upsertError) throw upsertError;

            // FIX 5: Create Demo Bot Chat with Priya Sharma
            const priyaId = '11111111-1111-1111-1111-111111111111';
            
            // Check if match already exists
            const { data: existingMatch } = await supabase.from('matches')
                .select('id')
                .or(`and(user1_id.eq.${user.id},user2_id.eq.${priyaId}),and(user1_id.eq.${priyaId},user2_id.eq.${user.id})`)
                .single();

            if (!existingMatch) {
                const { data: matchData, error: matchError } = await supabase.from('matches').insert({
                    user1_id: priyaId,
                    user2_id: user.id
                }).select().single();

                if (matchData) {
                    const now = Date.now();
                    await supabase.from('messages').insert([
                        { 
                            match_id: matchData.id, 
                            sender_id: priyaId, 
                            content: "Hey! I made the first move 😄 What's your go-to weekend plan?", 
                            created_at: new Date(now - 3 * 60000).toISOString() 
                        },
                        { 
                            match_id: matchData.id, 
                            sender_id: priyaId, 
                            content: "I'm guessing either Netflix or some outdoor adventure — am I right? 😄", 
                            created_at: new Date(now - 60000).toISOString() 
                        }
                    ]);
                }
            }

            setSaving(false);
            setTimeout(() => {
                router.replace('/(tabs)');
            }, 1500);
        } catch (err: any) {
            console.error("Profile save error:", err);
            setError(err.message || "Failed to save profile");
            setSaving(false);
        }
    };

    saveProfile();
  }, [user]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handleRetry = () => {
    setError(null);
    setSaving(true);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <View style={styles.iconContainer}>
          <Hexagon size={120} color="black" fill="black" />
          <PartyPopper size={60} color={Colors.primary} style={styles.icon} />
        </View>
        
        <Text style={styles.title}>Your profile is ready!</Text>
        
        {saving ? (
            <View style={styles.statusContainer}>
                <Text style={styles.subtitle}>Saving your details...</Text>
                <ActivityIndicator color="black" style={{ marginTop: 20 }} />
            </View>
        ) : error ? (
            <View style={styles.errorContainer}>
                <AlertCircle size={40} color="#D32F2F" style={{ marginBottom: 10 }} />
                <Text style={styles.errorText}>{error}</Text>
                <BumbleButton title="Try Again / Enter App" onPress={handleRetry} style={{ marginTop: 20 }} />
            </View>
        ) : (
            <View style={styles.statusContainer}>
                <Text style={styles.subtitle}>Get ready to make the first move.</Text>
                <BumbleButton 
                    title="Enter Bumble" 
                    onPress={() => router.replace('/(tabs)')} 
                    style={{ marginTop: 30, width: 200 }} 
                />
            </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  icon: {
    position: 'absolute',
  },
  title: {
    fontFamily: 'Inter_900Black',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
  statusContainer: {
    alignItems: 'center',
    width: '100%',
  },
  errorContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    width: '100%',
  },
  errorText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 10,
  },
});
