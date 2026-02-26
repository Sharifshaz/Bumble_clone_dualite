import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { ChevronLeft, Send } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function ChatDetailScreen() {
  const { id, name, avatar } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${id}` }, payload => {
          setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  const fetchMessages = async () => {
      const { data } = await supabase
          .from('messages')
          .select('*')
          .eq('match_id', id)
          .order('created_at', { ascending: true });
      if (data) setMessages(data);
  };

  const sendMessage = async () => {
      if (!inputText.trim() || !user) return;
      const text = inputText;
      setInputText('');
      
      await supabase.from('messages').insert({
          match_id: id,
          sender_id: user.id,
          content: text
      });
  };

  const renderMessage = ({ item }: { item: any }) => {
      const isMe = item.sender_id === user?.id;
      return (
          <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
              <Text style={[styles.messageText, isMe && styles.myMessageText]}>{item.content}</Text>
          </View>
      );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={28} color="black" />
        </TouchableOpacity>
        <Image source={{ uri: avatar as string }} style={styles.headerAvatar} />
        <Text style={styles.headerName}>{name}</Text>
      </View>

      <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
          <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
              <Send size={20} color="white" />
          </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.gray, backgroundColor: 'white' },
  backBtn: { marginRight: 12 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  headerName: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  messagesContainer: { padding: 16, gap: 12 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 20 },
  myMessage: { backgroundColor: Colors.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  theirMessage: { backgroundColor: Colors.gray, alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  messageText: { fontFamily: 'Inter_400Regular', fontSize: 15, color: 'black' },
  myMessageText: { color: 'black' },
  inputContainer: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: Colors.gray, alignItems: 'center', backgroundColor: 'white' },
  input: { flex: 1, backgroundColor: Colors.gray, borderRadius: 20, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, maxHeight: 100, fontFamily: 'Inter_400Regular', fontSize: 15 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
});
