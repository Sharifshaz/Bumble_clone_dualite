import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/Colors';

interface BumbleButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'facebook';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  loading?: boolean;
}

export const BumbleButton: React.FC<BumbleButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  icon,
  loading = false,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary': return Colors.secondary; // Black
      case 'secondary': return Colors.white;
      case 'facebook': return Colors.facebook;
      case 'outline': return 'transparent';
      default: return Colors.secondary;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary': return Colors.white;
      case 'secondary': return Colors.text;
      case 'facebook': return Colors.white;
      case 'outline': return Colors.text;
      default: return Colors.white;
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') return Colors.secondary;
    return 'transparent';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon && icon}
          <Text style={[styles.text, { color: getTextColor(), marginLeft: icon ? 10 : 0 }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '100%',
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
});
