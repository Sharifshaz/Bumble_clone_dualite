import { Tabs } from 'expo-router';
import { User, Flame, MessageCircle, Heart, Grid } from 'lucide-react-native';
import { Colors } from '../../constants/Colors';
import { View, Text, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.gray,
        },
        tabBarActiveTintColor: Colors.primary, // Yellow active state
        tabBarInactiveTintColor: Colors.lightGray,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <User color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="for-you"
        options={{
          tabBarIcon: ({ color }) => <Flame color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Grid color={color} size={28} />, 
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          tabBarIcon: ({ color }) => (
            <View>
              <Heart color={color} size={28} />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>99+</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color }) => <MessageCircle color={color} size={28} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'white',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'black',
  },
});
