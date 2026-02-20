import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { OnboardingWrapper } from '../../components/OnboardingWrapper';
import { BumbleButton } from '../../components/BumbleButton';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Check } from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';

export default function GenderScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    updateData({ gender: selected });
    router.push('/onboarding/interested-in');
  };

  const options = ['Woman', 'Man', 'Non-binary'];

  return (
    <OnboardingWrapper step={3}>
      <Text style={styles.title}>I am a...</Text>

      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity 
            key={option} 
            style={[styles.card, selected === option && styles.selectedCard]}
            onPress={() => setSelected(option)}
          >
            <Text style={styles.cardText}>{option}</Text>
            {selected === option && <Check size={20} color={Colors.primary} />}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <BumbleButton title="Continue" onPress={handleContinue} />
      </View>
    </OnboardingWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Inter_900Black',
    fontSize: 32,
    color: Colors.text,
    marginBottom: 30,
  },
  optionsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#E6B800',
  },
  cardText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 40,
  },
});
