import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../constants/Colors';
import { BumbleButton } from '../components/BumbleButton';
import { useRouter } from 'expo-router';
import { Hexagon, Smartphone, Mail } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();

  const handleEmailLogin = () => {
    router.push('/auth/email');
  };

  return (
    <View style={styles.container}>
      {/* Honeycomb Pattern Background */}
      <View style={styles.patternOverlay}>
        {Array.from({ length: 25 }).map((_, i) => (
          <Hexagon 
            key={i} 
            size={width * 0.4} 
            color="#FFC800" 
            strokeWidth={1}
            style={{ 
              position: 'absolute', 
              top: Math.random() * height, 
              left: Math.random() * width - 50, 
              opacity: 0.15,
              transform: [{ rotate: `${Math.random() * 360}deg` }]
            }} 
          />
        ))}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Hexagon color="black" size={80} fill="black" />
            <View style={styles.logoLines}>
               <View style={[styles.line, { width: 40 }]} />
               <View style={[styles.line, { width: 50 }]} />
               <View style={[styles.line, { width: 30 }]} />
            </View>
          </View>
        </View>

        <View style={styles.mainSection}>
          <Text style={styles.headline}>MAKE THE</Text>
          <Text style={styles.headline}>FIRST MOVE</Text>
        </View>

        <View style={styles.footer}>
          <BumbleButton
            title="Continue with Email"
            onPress={handleEmailLogin}
            icon={<Mail color="white" size={20} />}
          />
          <BumbleButton
            title="Use cell phone number"
            onPress={() => router.push('/phone-verify')}
            variant="outline"
            icon={<Smartphone color="black" size={20} />}
          />
          
          <Text style={styles.disclaimer}>
            By signing up, you agree to our Terms. See how we use your data in our Privacy Policy. We never post to Facebook.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLines: {
    position: 'absolute',
    top: 24,
    alignItems: 'center',
    gap: 4,
  },
  line: {
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  mainSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    fontFamily: 'Inter_900Black',
    fontSize: 40,
    textAlign: 'center',
    color: '#FFFFFF', // FIX 6: Changed to pure white
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    letterSpacing: 2,
    shadowColor: 'black',
    shadowOpacity: 1,
  },
  footer: {
    gap: 16,
    paddingBottom: 40,
  },
  disclaimer: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
    paddingHorizontal: 20,
  },
});
