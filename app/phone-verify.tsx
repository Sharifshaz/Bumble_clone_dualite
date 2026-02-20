import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../constants/Colors';
import { useRouter } from 'expo-router';
import { ChevronLeft, Lock, Delete, Signal, Wifi, Battery } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function PhoneVerifyScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePress = (key: string) => {
    if (key === 'backspace') {
      setPhoneNumber(prev => prev.slice(0, -1));
    } else {
      if (phoneNumber.length < 10) {
        const newNum = phoneNumber + key;
        setPhoneNumber(newNum);
        if (newNum.length >= 10) {
          // Navigate to Onboarding instead of Tabs
          setTimeout(() => {
            router.push('/onboarding/name');
          }, 500);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Simulated Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.timeText}>9:41</Text>
        <View style={styles.statusIcons}>
          <Signal size={16} color="black" />
          <Wifi size={16} color="black" />
          <Battery size={20} color="black" />
        </View>
      </View>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color="black" size={28} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>What's your number?</Text>
        <Text style={styles.subtitle}>We protect our community by making sure everyone on Bumble is real.</Text>

        <View style={styles.inputContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.countryText}>US +1</Text>
          </View>
          <View style={styles.numberInput}>
            <Text style={[styles.numberText, !phoneNumber && styles.placeholder]}>
              {phoneNumber || '000 000 0000'}
            </Text>
          </View>
        </View>

        <View style={styles.secureNote}>
          <Lock size={14} color={Colors.darkGray} />
          <Text style={styles.secureText}>We never share this with anyone and it won't be on your profile.</Text>
        </View>
      </View>

      <View style={styles.keyboard}>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
          ['', '0', 'backspace']
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((key, keyIndex) => (
              <TouchableOpacity
                key={keyIndex}
                style={styles.key}
                onPress={() => key && handlePress(key)}
                disabled={!key}
              >
                {key === 'backspace' ? (
                  <Delete color="black" size={24} />
                ) : (
                  <Text style={styles.keyText}>{key}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  statusBar: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  timeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    marginTop: 20,
    flex: 1,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: Colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    height: 56,
    gap: 12,
  },
  countryCode: {
    width: 80,
    backgroundColor: Colors.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  numberInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  numberText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: Colors.text,
  },
  placeholder: {
    color: Colors.lightGray,
  },
  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  secureText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.darkGray,
    flex: 1,
  },
  keyboard: {
    backgroundColor: '#E8C64B',
    paddingBottom: 40,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  key: {
    width: width / 3,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    color: Colors.text,
  },
});
