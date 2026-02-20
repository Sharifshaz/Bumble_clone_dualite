import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Hexagon, PartyPopper } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function CompleteScreen() {
  const router = useRouter();
  const { data } = useOnboarding();
  const { user } = useAuth();
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10 });
    
    const saveProfile = async () => {
        if (!user) return;

        try {
            const { error } = await supabase.from('profiles').insert({
                id: user.id,
                first_name: data.firstName,
                birth_date: data.birthDate,
                gender: data.gender,
                interested_in: data.interestedIn,
                photos: data.photos,
                interests: data.interests,
            });

            if (error) throw error;

            setTimeout(() => {
                router.replace('/(tabs)');
            }, 2000);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    saveProfile();
  }, [user]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <View style={styles.iconContainer}>
          <Hexagon size={120} color="black" fill="black" />
          <PartyPopper size={60} color={Colors.primary} style={styles.icon} />
        </View>
        <Text style={styles.title}>Your profile is ready!</Text>
        <Text style={styles.subtitle}>Get ready to make the first move.</Text>
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
  },
  content: {
    alignItems: 'center',
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
  },
  subtitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
});
