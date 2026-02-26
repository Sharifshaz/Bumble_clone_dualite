import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { OnboardingWrapper } from '../../components/OnboardingWrapper';
import { BumbleButton } from '../../components/BumbleButton';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Plus, X } from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

// Create bucket named 'profile-photos' with public access in Supabase dashboard

export default function PhotosScreen() {
  const router = useRouter();
  const { updateData, data } = useOnboarding();
  const { user } = useAuth();
  const [photos, setPhotos] = useState<string[]>(data.photos || []);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    if (!user) return;
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setUploading(true);
      try {
        const ext = result.assets[0].uri.split('.').pop() || 'jpg';
        const fileName = `${user.id}/${Date.now()}.${ext}`;
        
        const { error } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, decode(result.assets[0].base64), { contentType: `image/${ext}` });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage.from('profile-photos').getPublicUrl(fileName);
        setPhotos(prev => [...prev, publicUrl]);
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload photo. Make sure 'profile-photos' bucket exists and is public.");
      } finally {
        setUploading(false);
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    updateData({ photos });
    router.push('/onboarding/interests');
  };

  return (
    <OnboardingWrapper step={5}>
      <Text style={styles.title}>Add your photos</Text>
      <Text style={styles.subtitle}>Upload at least 2 photos to continue.</Text>

      <View style={styles.grid}>
        {photos.map((photo, index) => (
            <View key={index} style={styles.photoBox}>
                <Image source={{ uri: photo }} style={styles.image} />
                <TouchableOpacity style={styles.removeBtn} onPress={() => removePhoto(index)}>
                    <X size={16} color="white" />
                </TouchableOpacity>
            </View>
        ))}
        
        {photos.length < 6 && (
            <TouchableOpacity style={styles.photoBox} onPress={pickImage} disabled={uploading}>
                <View style={styles.addButton}>
                    {uploading ? <ActivityIndicator color={Colors.primary} /> : <Plus size={32} color={Colors.primary} />}
                </View>
            </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <BumbleButton 
            title="Continue" 
            onPress={handleContinue} 
            disabled={photos.length < 2 || uploading} 
            style={{ opacity: photos.length < 2 ? 0.5 : 1 }}
        />
      </View>
    </OnboardingWrapper>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: 'Inter_900Black', fontSize: 32, color: Colors.text, marginBottom: 10 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 16, color: Colors.text, marginBottom: 30 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  photoBox: { width: '31%', aspectRatio: 0.7, borderRadius: 12, overflow: 'hidden', backgroundColor: '#FFE680', position: 'relative' },
  addButton: { flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#E6B800', borderStyle: 'dashed', borderRadius: 12 },
  image: { width: '100%', height: '100%' },
  removeBtn: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, padding: 4 },
  footer: { marginTop: 'auto', marginBottom: 40 },
});
