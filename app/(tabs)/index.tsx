import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  runOnJS, 
  interpolate,
  Extrapolation,
  withTiming
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { SlidersHorizontal, RotateCcw, Heart, X, Star, Zap } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { SwipeableCard } from '../../components/SwipeableCard';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

export default function MainScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    fetchProfiles();
  }, [user]);

  const fetchProfiles = async () => {
    if (!user) return;
    setLoading(true);
    
    const { data: swipes } = await supabase
        .from('swipes')
        .select('target_id')
        .eq('liker_id', user.id);

    const swipedIds = swipes?.map(s => s.target_id) || [];
    swipedIds.push(user.id);

    // FIX 1: Fetch profiles including demo users
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .not('id', 'in', `(${swipedIds.join(',')})`)
        .limit(20);

    if (data) {
        const formatted = data.map(p => ({
            id: p.id,
            name: p.first_name,
            age: p.birth_date ? new Date().getFullYear() - new Date(p.birth_date).getFullYear() : 25,
            distance: Math.floor(Math.random() * 20) + 1,
            bio: p.bio,
            images: p.photos || [],
            job: p.job || 'Professional',
            verified: p.is_demo || false,
            interests: p.interests || [],
            is_demo: p.is_demo
        }));
        setProfiles(formatted);
    }
    setLoading(false);
  };

  const handleSwipeComplete = useCallback(async (direction: 'left' | 'right') => {
    const profile = profiles[currentIndex];
    if (!profile || !user) return;

    const action = direction === 'right' ? 'like' : 'pass';
    await supabase.from('swipes').insert({
        liker_id: user.id,
        target_id: profile.id,
        action
    });

    if (action === 'like') {
        // FIX 1: Auto-match if it's a demo user
        if (profile.is_demo) {
            await supabase.from('matches').insert({
                user1_id: user.id,
                user2_id: profile.id
            });
            setTimeout(() => {
                router.push({ pathname: '/match', params: { matchId: profile.id, name: profile.name, photo: profile.images[0] } });
            }, 300);
        } else {
            const { data: theirSwipe } = await supabase
                .from('swipes')
                .select('*')
                .eq('liker_id', profile.id)
                .eq('target_id', user.id)
                .eq('action', 'like')
                .single();

            if (theirSwipe) {
                await supabase.from('matches').insert({
                    user1_id: user.id,
                    user2_id: profile.id
                });
                setTimeout(() => {
                    router.push({ pathname: '/match', params: { matchId: profile.id, name: profile.name, photo: profile.images[0] } });
                }, 300);
            }
        }
    }

    setCurrentIndex((prev) => prev + 1);
    translateX.value = 0;
    translateY.value = 0;
    rotate.value = 0;
  }, [profiles, currentIndex, user, router]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotate.value = interpolate(event.translationX, [-width, width], [-15, 15]);
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? 'right' : 'left';
        const targetX = direction === 'right' ? width * 1.5 : -width * 1.5;
        
        translateX.value = withTiming(targetX, { duration: 300 }, () => {
          runOnJS(handleSwipeComplete)(direction);
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
      ],
    };
  });

  const likeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, width / 4], [0, 1], Extrapolation.CLAMP),
  }));

  const nopeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -width / 4], [0, 1], Extrapolation.CLAMP),
  }));

  if (loading) {
      return (
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
              <ActivityIndicator size="large" color="black" />
          </View>
      );
  }

  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];

  if (!currentProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No more profiles nearby!</Text>
        <TouchableOpacity onPress={() => { setCurrentIndex(0); fetchProfiles(); }} style={styles.resetButton}>
          <Text style={styles.resetText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>bumble</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
             <RotateCcw size={20} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
             <SlidersHorizontal size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardsContainer}>
        {nextProfile && (
          <View style={[styles.cardWrapper, styles.nextCard]}>
            <SwipeableCard profile={nextProfile} />
          </View>
        )}

        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.cardWrapper, cardStyle]}>
            <SwipeableCard profile={currentProfile} />
            
            <Animated.View style={[styles.overlay, styles.likeOverlay, likeOpacity]}>
              <View style={[styles.overlayCircle, { borderColor: '#4CAF50' }]}>
                 <Heart size={40} color="#4CAF50" fill="#4CAF50" />
              </View>
            </Animated.View>
            
            <Animated.View style={[styles.overlay, styles.nopeOverlay, nopeOpacity]}>
              <View style={[styles.overlayCircle, { borderColor: '#FF4444' }]}>
                 <X size={40} color="#FF4444" />
              </View>
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.smallButton]} onPress={() => {}}>
           <RotateCcw size={24} color="#FBC02D" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.nopeButton]} onPress={() => {
            translateX.value = withTiming(-width * 1.5, { duration: 300 }, () => {
                runOnJS(handleSwipeComplete)('left');
            });
        }}>
           <X size={32} color="#FF4444" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.superLikeButton]} onPress={() => {}}>
           <Star size={28} color="#448AFF" fill="#448AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={() => {
            translateX.value = withTiming(width * 1.5, { duration: 300 }, () => {
                runOnJS(handleSwipeComplete)('right');
            });
        }}>
           <Heart size={32} color="#4CAF50" fill="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.smallButton]} onPress={() => {}}>
           <Zap size={24} color="#7B1FA2" fill="#7B1FA2" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 10 },
  logo: { fontFamily: 'Inter_900Black', fontSize: 28, color: Colors.text, letterSpacing: -1 },
  headerIcons: { flexDirection: 'row', gap: 12 },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' },
  cardsContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 10, zIndex: 1 },
  cardWrapper: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  nextCard: { transform: [{ scale: 0.95 }, { translateY: 10 }], opacity: 0.8, zIndex: -1 },
  overlay: { position: 'absolute', top: 40, zIndex: 100 },
  likeOverlay: { left: 40, transform: [{ rotate: '-30deg' }] },
  nopeOverlay: { right: 40, transform: [{ rotate: '30deg' }] },
  overlayCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', borderWidth: 4, elevation: 5 },
  actionButtonsContainer: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 20, paddingHorizontal: 10, zIndex: 2 },
  actionButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', elevation: 3 },
  smallButton: { width: 44, height: 44, borderRadius: 22 },
  nopeButton: { borderWidth: 1, borderColor: '#FFEBEE' },
  likeButton: { borderWidth: 1, borderColor: '#E8F5E9' },
  superLikeButton: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#E3F2FD' },
  emptyText: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: Colors.text, marginTop: 200, textAlign: 'center' },
  resetButton: { marginTop: 20, backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, alignSelf: 'center' },
  resetText: { fontFamily: 'Inter_600SemiBold' },
});
