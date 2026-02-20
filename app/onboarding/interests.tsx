import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { OnboardingWrapper } from '../../components/OnboardingWrapper';
import { BumbleButton } from '../../components/BumbleButton';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useOnboarding } from '../../context/OnboardingContext';

const INTERESTS = [
  "Cooking", "Travel", "Yoga", "Photography", "Music", 
  "Hiking", "Art", "Gaming", "Reading", "Fitness", 
  "Coffee", "Dogs", "Cats", "Wine", "Movies"
];

export default function InterestsScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    if (selected.includes(interest)) {
      setSelected(selected.filter(i => i !== interest));
    } else {
      setSelected([...selected, interest]);
    }
  };

  const handleFinish = () => {
    updateData({ interests: selected });
    router.push('/onboarding/complete');
  };

  return (
    <OnboardingWrapper step={6}>
      <Text style={styles.title}>Choose your interests</Text>
      <Text style={styles.subtitle}>Select at least 5 things you love</Text>

      <ScrollView contentContainerStyle={styles.tagsContainer} showsVerticalScrollIndicator={false}>
        {INTERESTS.map((interest) => {
          const isSelected = selected.includes(interest);
          return (
            <TouchableOpacity 
              key={interest} 
              style={[styles.tag, isSelected && styles.selectedTag]}
              onPress={() => toggleInterest(interest)}
            >
              <Text style={[styles.tagText, isSelected && styles.selectedTagText]}>{interest}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.counter}>{selected.length}/5 selected</Text>
        <BumbleButton title="Finish" onPress={handleFinish} />
      </View>
    </OnboardingWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Inter_900Black',
    fontSize: 32,
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingBottom: 20,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: '45%',
    alignItems: 'center',
  },
  selectedTag: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  tagText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: 'black',
  },
  selectedTagText: {
    color: 'white',
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 40,
    gap: 10,
  },
  counter: {
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
    color: Colors.darkGray,
  },
});
