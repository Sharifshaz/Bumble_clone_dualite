import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TextInput } from 'react-native';
import { Colors } from '../constants/Colors';
import { BumbleButton } from '../components/BumbleButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function MatchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>It's a match!</Text>
        <Text style={styles.subtitle}>You and {params.name} liked each other.</Text>

        <View style={styles.imagesContainer}>
           <Image 
             source={{ uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000' }} // Placeholder for self
             style={[styles.image, styles.imageLeft]} 
           />
           <Image 
             source={{ uri: params.photo as string }} 
             style={[styles.image, styles.imageRight]} 
           />
        </View>

        <View style={styles.promptContainer}>
          <Text style={styles.promptLabel}>Opening Move</Text>
          <View style={styles.promptBubble}>
            <Text style={styles.promptText}>What do you like about my profile?</Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput 
            placeholder={`Message ${params.name}...`}
            style={styles.input}
            placeholderTextColor={Colors.darkGray}
          />
          <Text style={styles.sendText}>Send</Text>
        </View>

        <BumbleButton 
          title="Keep Swiping" 
          variant="secondary" 
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)', // Dark overlay
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter_900Black',
    fontSize: 36,
    color: Colors.primary,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: 'white',
    marginBottom: 40,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 200,
    marginBottom: 40,
    width: '100%',
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: 'white',
    position: 'absolute',
  },
  imageLeft: {
    left: width / 2 - 120,
    zIndex: 1,
    transform: [{ rotate: '-10deg' }],
  },
  imageRight: {
    right: width / 2 - 120,
    zIndex: 2,
    transform: [{ rotate: '10deg' }],
  },
  promptContainer: {
    width: '100%',
    marginBottom: 20,
  },
  promptLabel: {
    color: Colors.primary,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  promptBubble: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
  },
  promptText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  sendText: {
    fontFamily: 'Inter_700Bold',
    color: Colors.primary,
  },
});
