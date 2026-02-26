import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, ActivityIndicator, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../../constants/Colors';
import { BumbleButton } from '../../components/BumbleButton';
import { Settings, Edit2, Crown, Rocket, Plus, X, Check } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
        fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
      setProfile(data);
      setEditForm(data);
      setLoading(false);
  };

  const handleSave = async () => {
      try {
          const { error } = await supabase.from('profiles').upsert({
              id: user?.id,
              first_name: editForm.first_name,
              city: editForm.city,
              bio: editForm.bio,
              photos: editForm.photos,
              interests: editForm.interests,
          });
          if (error) throw error;
          setProfile(editForm);
          setIsEditing(false);
          Alert.alert("Success", "Profile updated successfully!");
      } catch (e: any) {
          Alert.alert("Error", e.message || "Failed to update profile");
      }
  };

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
        setEditForm({ ...editForm, photos: [...(editForm.photos || []), publicUrl] });
      } catch (error) {
        Alert.alert("Upload Error", "Failed to upload photo.");
      } finally {
        setUploading(false);
      }
    }
  };

  if (loading) return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator color="black" /></View>;

  const age = profile ? new Date().getFullYear() - new Date(profile.birth_date).getFullYear() : 25;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Settings size={26} color="#333" onPress={signOut} />
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Profile' : 'Profile'}</Text>
        {isEditing ? (
            <Check size={26} color="#4CAF50" onPress={handleSave} />
        ) : (
            <Edit2 size={26} color="#333" onPress={() => setIsEditing(true)} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: editForm?.photos?.[0] || 'https://via.placeholder.com/150' }} style={styles.avatar} />
          </View>
          {isEditing ? (
              <TextInput style={styles.editInputName} value={editForm.first_name} onChangeText={(t) => setEditForm({...editForm, first_name: t})} placeholder="Name" />
          ) : (
              <Text style={styles.name}>{profile?.first_name}, {age}</Text>
          )}
          {isEditing && (
              <TextInput style={styles.editInputCity} value={editForm.city} onChangeText={(t) => setEditForm({...editForm, city: t})} placeholder="City" />
          )}
          {!isEditing && profile?.city && <Text style={styles.cityText}>{profile.city}</Text>}
        </View>

        {!isEditing && (
            <View style={styles.plansContainer}>
              <View style={styles.planCard}>
                 <View style={styles.planIconCircle}><Crown size={24} color={Colors.primary} fill={Colors.primary} /></View>
                 <Text style={styles.planTitle}>Premium</Text>
                 <Text style={styles.planSubtitle}>Active</Text>
              </View>
              <View style={styles.planCard}>
                 <View style={[styles.planIconCircle, { backgroundColor: '#F3E5F5' }]}><Rocket size={24} color="#7B1FA2" fill="#7B1FA2" /></View>
                 <Text style={styles.planTitle}>Boost</Text>
                 <Text style={styles.planSubtitle}>Get seen</Text>
              </View>
            </View>
        )}

        <View style={styles.section}>
           <Text style={styles.sectionTitle}>About Me</Text>
           <View style={styles.card}>
             {isEditing ? (
                 <TextInput 
                    style={styles.bioInput} 
                    multiline 
                    maxLength={300}
                    value={editForm.bio} 
                    onChangeText={(t) => setEditForm({...editForm, bio: t})} 
                    placeholder="Write something about yourself..."
                 />
             ) : (
                 <Text style={styles.bioText}>{profile?.bio || 'No bio yet.'}</Text>
             )}
             {isEditing && <Text style={styles.charCount}>{editForm.bio?.length || 0}/300</Text>}
           </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <View style={styles.photoGrid}>
             {editForm?.photos?.map((photo: string, i: number) => (
               <View key={i} style={styles.gridPhoto}>
                 <Image source={{ uri: photo }} style={{ width: '100%', height: '100%' }} />
                 {isEditing && (
                     <TouchableOpacity style={styles.removePhotoBtn} onPress={() => setEditForm({...editForm, photos: editForm.photos.filter((_:any, idx:number) => idx !== i)})}>
                         <X size={14} color="white" />
                     </TouchableOpacity>
                 )}
               </View>
             ))}
             {isEditing && (editForm?.photos?.length || 0) < 6 && (
                 <TouchableOpacity style={[styles.gridPhoto, styles.addPhotoBtn]} onPress={pickImage}>
                     {uploading ? <ActivityIndicator color={Colors.primary} /> : <Plus size={24} color={Colors.primary} />}
                 </TouchableOpacity>
             )}
          </View>
        </View>

        {!isEditing && (
            <View style={styles.section}>
               <BumbleButton title="Sign Out" onPress={signOut} variant="outline" />
            </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: 'black' },
  content: { padding: 20, paddingBottom: 100 },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 140, height: 140, borderRadius: 70, borderWidth: 4, borderColor: 'white' },
  name: { fontFamily: 'Inter_900Black', fontSize: 28, color: 'black' },
  cityText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#333', marginTop: 4 },
  editInputName: { fontFamily: 'Inter_900Black', fontSize: 28, color: 'black', textAlign: 'center', borderBottomWidth: 1, borderColor: '#333', minWidth: 150 },
  editInputCity: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#333', textAlign: 'center', borderBottomWidth: 1, borderColor: '#333', marginTop: 8, minWidth: 100 },
  plansContainer: { flexDirection: 'row', gap: 16, width: '100%', marginBottom: 30 },
  planCard: { flex: 1, backgroundColor: 'white', padding: 16, borderRadius: 16, alignItems: 'center', elevation: 4, height: 140, justifyContent: 'center' },
  planIconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  planTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, marginBottom: 4 },
  planSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.darkGray },
  section: { width: '100%', marginBottom: 24 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: 'black', marginBottom: 12 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 16, elevation: 2 },
  bioText: { fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 24, color: '#333' },
  bioInput: { fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 24, color: '#333', minHeight: 80, textAlignVertical: 'top' },
  charCount: { textAlign: 'right', fontSize: 12, color: Colors.darkGray, marginTop: 8 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridPhoto: { width: (width - 60) / 3, height: (width - 60) / 3, borderRadius: 8, overflow: 'hidden', backgroundColor: '#eee', position: 'relative' },
  addPhotoBtn: { backgroundColor: 'white', borderWidth: 2, borderColor: '#E6B800', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  removePhotoBtn: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10, padding: 4 },
});
