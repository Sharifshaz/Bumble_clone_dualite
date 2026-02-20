import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '../constants/Colors';
import { useRouter } from 'expo-router';
import { Hexagon } from 'lucide-react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Hexagon color="black" size={80} fill="black" />
        <View style={styles.linesContainer}>
           <View style={[styles.line, { width: 40 }]} />
           <View style={[styles.line, { width: 50 }]} />
           <View style={[styles.line, { width: 30 }]} />
        </View>
      </View>
      <Text style={styles.text}>bumble</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  linesContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  line: {
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  text: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    color: 'black',
    marginTop: 10,
  },
});
