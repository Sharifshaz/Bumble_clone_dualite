import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BadgeCheck, MapPin } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { Profile } from '../data/mock';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height * 0.65; // Adjusted height for new layout
const CARD_WIDTH = width * 0.92;

interface SwipeableCardProps {
  profile: Profile;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({ profile }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: profile.images[0] }} style={styles.image} resizeMode="cover" />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />

      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{profile.name}, {profile.age}</Text>
          {profile.verified && (
            <View style={styles.verifiedBadge}>
              <BadgeCheck size={18} color="white" fill="#1877F2" />
            </View>
          )}
        </View>
        
        <View style={styles.distanceRow}>
           <MapPin size={14} color={Colors.primary} />
           <Text style={styles.distanceText}>{profile.distance} km away</Text>
        </View>

        <Text style={styles.job}>{profile.job}</Text>
        
        <View style={styles.tagsContainer}>
          {profile.interests.map((interest, index) => (
             <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{interest}</Text>
             </View>
          ))}
        </View>
      </View>

      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: 'white',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.46,
    elevation: 9,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: 'white',
    marginRight: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  verifiedBadge: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 1,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  distanceText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#EEE',
  },
  job: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: 'white',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(0,0,0,0.6)', // Darker background for tags
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  dotsContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  activeDot: {
    backgroundColor: 'white',
    width: 10,
    height: 10,
    borderRadius: 5,
    top: -1,
  },
});
