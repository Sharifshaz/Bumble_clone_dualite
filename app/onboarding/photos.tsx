import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { OnboardingWrapper } from '../../components/OnboardingWrapper';
import { BumbleButton } from '../../components/BumbleButton';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Plus } from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';

export default function PhotosScreen() {
  const router = useRouter();
  const { updateData } = useOnboarding();

  // Using placeholder URLs for now since we don't have image upload logic implemented
  // In a real app, you'd use supabase.storage.upload
  const handleContinue = () => {
    updateData({ 
        photos: [
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400'
        ] 
    });
    router.push('/onboarding/interests');
  };

  return (
    <OnboardingWrapper step={5}>
      <Text style={styles.title}>Add your photos</Text>
      <Text style={styles.subtitle}>We've added some demo photos for you.</Text>

      <View style={styles.grid}>
        <View style={styles.photoBox}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400' }} style={styles.image} />
        </View>
        <View style={styles.photoBox}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400' }} style={styles.image} />
        </View>
        <TouchableOpacity style={styles.photoBox}>
             <View style={styles.addButton}>
                <Plus size={32} color={Colors.primary} />
             </View>
        </TouchableOpacity>
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
    marginBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoBox: {
    width: '31%',
    aspectRatio: 0.7,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFE680',
    position: 'relative',
  },
  addButton: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E6B800',
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  footer: {
    marginTop: 'auto',
    marginBottom: 40,
  },
});
