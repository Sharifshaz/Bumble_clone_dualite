import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors } from '../constants/Colors';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface OnboardingWrapperProps {
  children: React.ReactNode;
  step: number;
  totalSteps?: number;
  showBack?: boolean;
}

export const OnboardingWrapper: React.FC<OnboardingWrapperProps> = ({ 
  children, 
  step, 
  totalSteps = 6,
  showBack = true 
}) => {
  const router = useRouter();
  const progress = (step / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      
      <View style={styles.header}>
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft color="black" size={28} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '100%',
    marginTop: 50,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#E6B800', // Darker yellow/gold
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    height: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
});
