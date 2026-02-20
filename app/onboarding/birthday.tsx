import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput } from 'react-native';
import { OnboardingWrapper } from '../../components/OnboardingWrapper';
import { BumbleButton } from '../../components/BumbleButton';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useOnboarding } from '../../context/OnboardingContext';

export default function BirthdayScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const [year, setYear] = useState('2000');

  const handleContinue = () => {
    const date = new Date(parseInt(year), 0, 1);
    updateData({ birthDate: date });
    router.push('/onboarding/gender');
  };

  return (
    <OnboardingWrapper step={2}>
      <Text style={styles.title}>When's your birthday?</Text>
      <Text style={styles.subtitle}>Your age will be public, but your birthday won't be.</Text>

      <View style={styles.inputContainer}>
         <Text style={styles.label}>Year of Birth</Text>
         <TextInput 
            style={styles.input}
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
            maxLength={4}
         />
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
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 40,
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 40,
  },
});
