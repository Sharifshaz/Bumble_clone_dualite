import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { OnboardingWrapper } from '../../components/OnboardingWrapper';
import { BumbleButton } from '../../components/BumbleButton';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Check } from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';

export default function InterestedInScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (option: string) => {
    if (selected.includes(option)) {
      setSelected(selected.filter(s => s !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    updateData({ interestedIn: selected });
    router.push('/onboarding/photos');
  };

  const options = ['Women', 'Men', 'Everyone'];

  return (
    <OnboardingWrapper step={4}>
      <Text style={styles.title}>Show me...</Text>

      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity 
            key={option} 
            style={[styles.card, selected.includes(option) && styles.selectedCard]}
            onPress={() => toggleSelection(option)}
          >
            <Text style={styles.cardText}>{option}</Text>
            {selected.includes(option) && <Check size={20} color={Colors.primary} />}
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
