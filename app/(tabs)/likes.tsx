import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../../constants/Colors';
import { MOCK_PROFILES } from '../../data/mock';
import { SlidersHorizontal } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

export default function LikesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Liked You</Text>
        <SlidersHorizontal size={24} color={Colors.text} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.upgradeCard}>
          <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
          <Text style={styles.upgradeSubtitle}>See who likes you and match instantly.</Text>
        </View>

        <View style={styles.filterTabs}>
          <View style={[styles.tab, styles.activeTab]}>
             <Text style={styles.tabTextActive}>All 560</Text>
          </View>
          <View style={styles.tab}>
             <Text style={styles.tabText}>New 100</Text>
          </View>
          <View style={styles.tab}>
             <Text style={styles.tabText}>Nearby 68</Text>
          </View>
        </View>

        <View style={styles.grid}>
          {MOCK_PROFILES.map((profile, index) => (
            <View key={profile.id} style={styles.gridItem}>
              <Image source={{ uri: profile.images[0] }} style={styles.gridImage} />
              <BlurView intensity={40} style={styles.blur} tint="light" />
              <View style={styles.notificationBadge}>
                 <Text style={styles.badgeText}>New</Text>
              </View>
            </View>
          ))}
          {/* Duplicate for grid fill */}
          {MOCK_PROFILES.map((profile, index) => (
            <View key={`dup-${profile.id}`} style={styles.gridItem}>
              <Image source={{ uri: profile.images[0] }} style={styles.gridImage} />
              <BlurView intensity={40} style={styles.blur} tint="light" />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: Colors.text,
  },
  scrollContent: {
    padding: 16,
  },
  upgradeCard: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  upgradeTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  upgradeSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  filterTabs: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.gray,
  },
  activeTab: {
    backgroundColor: Colors.text,
  },
  tabText: {
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
    fontSize: 13,
  },
  tabTextActive: {
    fontFamily: 'Inter_600SemiBold',
    color: 'white',
    fontSize: 13,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridItem: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH * 1.4,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#eee',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
});
