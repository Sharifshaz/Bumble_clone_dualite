import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/Colors';
import { BumbleButton } from '../../components/BumbleButton';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { ChevronLeft } from 'lucide-react-native';

export default function EmailAuthScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleAuth() {
    setErrorMsg(null);
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user && !data.session) {
            setErrorMsg('Success! Please check your email for a confirmation link.');
            Alert.alert('Check your email', 'Please check your email for a confirmation link.');
        } else {
            // Auto-login successful, AuthContext will handle redirect
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      console.log("Auth Error:", error.message);
      if (error.message === 'Email not confirmed') {
        setErrorMsg('Please verify your email address before signing in.');
      } else {
        setErrorMsg(error.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="black" size={28} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>
        <Text style={styles.subtitle}>
          {isSignUp ? 'Sign up to start matching' : 'Sign in to continue'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        {errorMsg && (
          <Text style={styles.errorText}>{errorMsg}</Text>
        )}

        <BumbleButton
          title={isSignUp ? 'Sign Up' : 'Sign In'}
          onPress={handleAuth}
          loading={loading}
        />

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={styles.switchButton}>
          <Text style={styles.switchText}>
            {isSignUp ? 'Already have an account? Sign In' : 'New here? Create Account'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter_900Black',
    fontSize: 32,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 32,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginBottom: 16,
    color: 'black',
  },
  errorText: {
    color: '#D32F2F',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
  },
  switchText: {
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
});
