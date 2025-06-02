import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import {
  ArrowLeft,
  Send,
  Image as ImageIcon,
  Camera,
  Mic,
  Bot,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AIAssistanceScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your AI assistant. How can I help you find the perfect service provider today?",
      timestamp: new Date(),
    },
  ]);
  const scrollViewRef = useRef(null);

  const handleSend = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'll help you find the best service providers based on your requirements. Could you please specify what type of service you're looking for?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      // Handle the selected image
      const imageMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: result.assets[0].uri,
        messageType: 'image',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, imageMessage]);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      // Handle the captured photo
      const imageMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: result.assets[0].uri,
        messageType: 'image',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, imageMessage]);
    }
  };

  const renderMessage = (message) => {
    const isUser = message.type === 'user';
    const isImage = message.messageType === 'image';

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.botMessage,
        ]}
      >
        {!isUser && (
          <View style={styles.botAvatar}>
            <Bot size={20} color={COLORS.accent} />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.botBubble,
          ]}
        >
          {isImage ? (
            <Image
              source={{ uri: message.content }}
              style={styles.messageImage}
              resizeMode="cover"
            />
          ) : (
            <Text
              style={[
                styles.messageText,
                isUser ? styles.userMessageText : styles.botMessageText,
              ]}
            >
              {message.content}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.text.heading} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((msg) => (
            <View key={msg.id}>{renderMessage(msg)}</View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <Send
                size={20}
                color={message.trim() ? COLORS.accent : '#9E9E9E'}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
              <ImageIcon size={20} color={COLORS.accent} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
              <Camera size={20} color={COLORS.accent} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/voice-help')}
            >
              <Mic size={20} color={COLORS.accent} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.heading,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${COLORS.accent}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 20,
    padding: 12,
    ...SHADOWS.card,
  },
  userBubble: {
    backgroundColor: COLORS.accent,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
    fontFamily: 'Inter-Regular',
  },
  botMessageText: {
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 40,
    maxHeight: 100,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  sendButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.accent}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
});