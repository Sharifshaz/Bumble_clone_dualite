import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/Colors';
import { BumbleButton } from '../../components/BumbleButton';
import { Settings, Edit2, Crown, Rocket } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
        supabase.from('profiles').select('*').eq('id', user.id).single()
            .then(({ data }) => {
                setProfile(data);
                setLoading(false);
            });
    }
  }, [user]);

  if (loading) {
      return (
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
              <ActivityIndicator color="black" />
          </View>
      );
  }

  const age = profile ? new Date().getFullYear() - new Date(profile.birth_date).getFullYear() : 25;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Settings size={26} color="#333" onPress={signOut} />
        <Text style={styles.headerTitle}>Profile</Text>
        <Edit2 size={26} color="#333" />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: profile?.photos?.[0] || 'https://via.placeholder.com/150' }} 
              style={styles.avatar} 
            />
            <View style={styles.completionBadge}>
              <Text style={styles.completionText}>80%</Text>
            </View>
          </View>
          <Text style={styles.name}>{profile?.first_name}, {age}</Text>
        </View>

        <View style={styles.plansContainer}>
          <View style={styles.planCard}>
             <View style={styles.planIconCircle}>
               <Crown size={24} color={Colors.primary} fill={Colors.primary} />
             </View>
             <Text style={styles.planTitle}>Premium</Text>
             <Text style={styles.planSubtitle}>Active</Text>
          </View>
          <View style={styles.planCard}>
             <View style={[styles.planIconCircle, { backgroundColor: '#F3E5F5' }]}>
               <Rocket size={24} color="#7B1FA2" fill="#7B1FA2" />
             </View>
             <Text style={styles.planTitle}>Boost</Text>
             <Text style={styles.planSubtitle}>Get seen</Text>
          </View>
        </View>

        <View style={styles.section}>
           <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>About Me</Text>
           </View>
           <View style={styles.card}>
             <Text style={styles.bioText}>{profile?.bio || 'No bio yet.'}</Text>
           </View>
        </View>

        <View style={styles.section}>
           <Text style={styles.sectionTitle}>My Interests</Text>
           <View style={styles.tagsContainer}>
             {profile?.interests?.map((tag: string) => (
               <View key={tag} style={styles.tag}>
                 <Text style={styles.tagText}>{tag}</Text>
               </View>
             ))}
           </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <View style={styles.photoGrid}>
             {profile?.photos?.map((photo: string, i: number) => (
               <View key={i} style={styles.gridPhoto}>
                 <Image 
                   source={{ uri: photo }} 
                   style={{ width: '100%', height: '100%' }} 
                 />
               </View>
             ))}
          </View>
        </View>

        <View style={styles.section}>
           <BumbleButton title="Sign Out" onPress={signOut} variant="outline" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary, // Yellow background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: 'black',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: 'white',
  },
  completionBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
    elevation: 4,
  },
  completionText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: 'black',
  },
  name: {
    fontFamily: 'Inter_900Black',
    fontSize: 28,
    color: 'black',
  },
  plansContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    marginBottom: 30,
  },
  planCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    height: 140,
    justifyContent: 'center',
  },
  planIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  planTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  planSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.darkGray,
  },
  section: {
    width: '100%',
    marginBottom: 24,
  },
  sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: 'black',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bioText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tagText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridPhoto: {
    width: (width - 60) / 3,
    height: (width - 60) / 3,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
});
