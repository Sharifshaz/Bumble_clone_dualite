import React, { useState } from 'react';
import { Text, StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { OnboardingWrapper } from '../../components/OnboardingWrapper';
import { BumbleButton } from '../../components/BumbleButton';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useOnboarding } from '../../context/OnboardingContext';

export default function NameScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();
  const [name, setName] = useState('');

  const handleContinue = () => {
    if (!name.trim()) return;
    updateData({ firstName: name });
    router.push('/onboarding/birthday');
  };

  return (
    <OnboardingWrapper step={1} showBack={false}>
      <Text style={styles.title}>Welcome to Bumble!</Text>
      <Text style={styles.subtitle}>Let's set up your profile so you can start making connections.</Text>

      <Text style={styles.label}>What's your first name?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor={Colors.lightGray}
        value={name}
        onChangeText={setName}
      />

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
    lineHeight: 24,
  },
  label: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 20,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 40,
  },
});
