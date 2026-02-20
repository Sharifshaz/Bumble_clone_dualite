import { Stack } from 'expo-router';
import { View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { OnboardingProvider } from '../../context/OnboardingContext';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: Colors.primary }
      }}>
        <Stack.Screen name="name" />
        <Stack.Screen name="birthday" />
        <Stack.Screen name="gender" />
        <Stack.Screen name="interested-in" />
        <Stack.Screen name="photos" />
        <Stack.Screen name="interests" />
        <Stack.Screen name="complete" options={{ animation: 'fade' }} />
      </Stack>
    </OnboardingProvider>
  );
}
