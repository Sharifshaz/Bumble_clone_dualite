import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Search } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function ChatScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
        fetchMatches();
    }
  }, [user]);

  const fetchMatches = async () => {
      const { data, error } = await supabase
          .from('matches')
          .select(`
              id,
              user1:profiles!user1_id(id, first_name, photos, is_demo),
              user2:profiles!user2_id(id, first_name, photos, is_demo),
              messages(content, created_at)
          `)
          .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`);

      if (data) {
          const formatted = data.map((m: any) => {
              const otherUser = m.user1.id === user?.id ? m.user2 : m.user1;
              const lastMessage = m.messages?.sort((a:any, b:any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
              
              return {
                  id: m.id,
                  matchId: m.id,
                  otherUserId: otherUser.id,
                  name: otherUser.first_name,
                  avatar: otherUser.photos?.[0] || 'https://via.placeholder.com/150',
                  message: lastMessage?.content || 'Start chatting!',
                  time: lastMessage ? new Date(lastMessage.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Now',
                  unread: !!lastMessage,
                  is_demo: otherUser.is_demo
              };
          });

          // FIX 5: Sort so Priya (Demo User 1) is always pinned at the top
          formatted.sort((a, b) => {
             if (a.is_demo && !b.is_demo) return -1;
             if (!a.is_demo && b.is_demo) return 1;
             return 0;
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
             <TouchableOpacity style={styles.queueItem} onPress={() => router.push(`/chat/${item.matchId}?name=${item.name}&avatar=${encodeURIComponent(item.avatar)}`)}>
                <Image source={{ uri: item.avatar }} style={styles.queueAvatar} />
                <Text style={styles.queueName}>{item.name}</Text>
             </TouchableOpacity>
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
            <TouchableOpacity 
                style={styles.chatItem} 
                onPress={() => router.push(`/chat/${item.matchId}?name=${item.name}&avatar=${encodeURIComponent(item.avatar)}`)}
            >
              <View>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                {item.unread && <View style={styles.unreadDot} />}
              </View>
              <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                  <Text style={styles.name}>{item.name} {item.is_demo && '📌'}</Text>
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
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 24, color: Colors.text },
  matchQueue: { height: 120, borderBottomWidth: 1, borderBottomColor: Colors.gray, marginBottom: 10 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.darkGray, marginLeft: 20, marginBottom: 12, textTransform: 'uppercase' },
  queueItem: { alignItems: 'center', gap: 6 },
  queueAvatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: Colors.primary },
  queueName: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  messagesList: { flex: 1 },
  chatItem: { flexDirection: 'row', padding: 20, alignItems: 'center', gap: 16 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  unreadDot: { position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: Colors.primary, borderWidth: 2, borderColor: 'white' },
  chatContent: { flex: 1, gap: 4 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  time: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.darkGray },
  message: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.darkGray },
  unreadMessage: { fontFamily: 'Inter_600SemiBold', color: Colors.text },
});
