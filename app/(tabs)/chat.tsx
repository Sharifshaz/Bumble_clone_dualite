import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Search } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function ChatScreen() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
        fetchMatches();
    }
  }, [user]);

  const fetchMatches = async () => {
      // Fetch matches where user is user1 or user2
      const { data, error } = await supabase
          .from('matches')
          .select(`
              id,
              user1:profiles!user1_id(id, first_name, photos),
              user2:profiles!user2_id(id, first_name, photos)
          `)
          .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`);

      if (data) {
          const formatted = data.map((m: any) => {
              const otherUser = m.user1.id === user?.id ? m.user2 : m.user1;
              return {
                  id: m.id,
                  name: otherUser.first_name,
                  avatar: otherUser.photos?.[0] || 'https://via.placeholder.com/150',
                  message: 'Start chatting!', // Needs message fetching logic
                  time: 'Now',
                  unread: true
              };
          });
          setMatches(formatted);
      }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat</Text>
        <Search size={24} color={Colors.text} />
      </View>

      <View style={styles.matchQueue}>
         <Text style={styles.sectionTitle}>Match Queue</Text>
         <FlatList 
           horizontal
           data={matches}
           showsHorizontalScrollIndicator={false}
           contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
           renderItem={({ item }) => (
             <View style={styles.queueItem}>
                <Image source={{ uri: item.avatar }} style={styles.queueAvatar} />
                <Text style={styles.queueName}>{item.name}</Text>
             </View>
           )}
           keyExtractor={item => item.id}
           ListEmptyComponent={<Text style={{marginLeft: 20, color: '#999'}}>No matches yet.</Text>}
         />
      </View>

      <View style={styles.messagesList}>
        <Text style={[styles.sectionTitle, { marginLeft: 20, marginBottom: 10 }]}>Conversations</Text>
        <FlatList
          data={matches}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={{marginLeft: 20, color: '#999'}}>Start swiping to get matches!</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.chatItem}>
              <View>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                {item.unread && <View style={styles.unreadDot} />}
              </View>
              <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={[styles.message, item.unread && styles.unreadMessage]} numberOfLines={1}>
                  {item.message}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
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
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: Colors.text,
  },
  matchQueue: {
    height: 120,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: Colors.darkGray,
    marginLeft: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  queueItem: {
    alignItems: 'center',
    gap: 6,
  },
  queueAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  queueName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  messagesList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  unreadDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: 'white',
  },
  chatContent: {
    flex: 1,
    gap: 4,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  time: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.darkGray,
  },
  message: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.darkGray,
  },
  unreadMessage: {
    fontFamily: 'Inter_600SemiBold',
    color: Colors.text,
  },
});
