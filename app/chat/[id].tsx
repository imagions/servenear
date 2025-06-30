import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Animated,
  KeyboardAvoidingView,
  Keyboard,
  Modal,
  Pressable,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import {
  ArrowLeft,
  Video,
  Phone,
  Camera,
  Image as ImageIcon,
  MapPin,
  Send,
  Mic,
  Plus,
  X,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useAudioRecorder, requestRecordingPermissionsAsync, setAudioModeAsync, RecordingPresets } from 'expo-audio';
import { LinearGradient } from 'expo-linear-gradient';

// Dummy data for testing
const MOCK_MESSAGES = [
  {
    id: '1',
    text: 'Hello! How can I help you today?',
    isSent: false,
    timestamp: new Date(),
  },
  // ... add more mock messages
];

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const providerName = params.name || 'Unknown Provider';
  const providerImage =
    params.providerImage ||
    'https://picsum.photos/200';
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showAttachments, setShowAttachments] = useState(false);
  const [galleryModalVisible, setGalleryModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const recordingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const attachmentsAnimation = useRef(new Animated.Value(0)).current;
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  // Initialize audio recording
  useEffect(() => {
    requestRecordingPermissionsAsync();
    setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    return () => {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    };
  }, []);

  // Keyboard handling for scroll-to-bottom
  useEffect(() => {
    const keyboardDidShow = () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };
    const showSub = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    return () => {
      showSub.remove();
    };
  }, []);

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: inputText,
          isSent: true,
          timestamp: new Date(),
        },
      ]);
      setInputText('');
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    setRecordingDuration(0);
    recordingTimer.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 1);
    }, 1000);
    await requestRecordingPermissionsAsync();
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    recorder.record();
  };

  const stopRecording = async () => {
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
    }
    setIsRecording(false);
    await recorder.stop();
    setRecordingDuration(0);
    // Access URI via recorder.uri
  };

  const toggleAttachments = () => {
    setShowAttachments((prev) => !prev);
    Animated.timing(attachmentsAnimation, {
      toValue: showAttachments ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleImagePick = async (useCamera: boolean) => {
    setGalleryModalVisible(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });

    if (!result.canceled) {
      // Handle image
    }
  };

  const handleLocationShare = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      // Handle location sharing
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'COLORS.background' }}
      behavior={'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={COLORS.text.heading} />
          </TouchableOpacity>

          <View style={styles.headerTitle}>
            <Image
              source={{ uri: providerImage }}
              style={styles.providerImage}
            />
            <View>
              <Text style={styles.providerName}>{providerName}</Text>
              <Text style={styles.onlineStatus}>Online</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Video size={20} color={COLORS.text.heading} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={() => {
              router.push({
                pathname: `/call/${params.id}` as any,
                params: { name: providerName, providerImage: providerImage },
              });
            }}>
              <Phone size={20} color={COLORS.text.heading} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={() => setGalleryModalVisible(true)}
          >
            <Plus size={24} color={COLORS.text.body} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={inputText}
            placeholderTextColor="#9E9E9E"
            onChangeText={setInputText}
            placeholder="Type a message..."
            multiline
          />

          {inputText ? (
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Send size={24} color={COLORS.accent} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.micButton}
              onLongPress={startRecording}
              onPressOut={stopRecording}
            >
              <Mic size={24} color={isRecording ? 'red' : COLORS.accent} />
              {isRecording && (
                <Text style={styles.recordingTime}>{recordingDuration}s</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Gallery Modal */}
        <Modal
          visible={galleryModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setGalleryModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setGalleryModalVisible(false)}
          >
            <View style={styles.attachmentsContainerModal}>
              <View style={styles.attachmentOptions}>
                <TouchableOpacity
                  style={styles.attachmentOption}
                  onPress={() => {
                    setGalleryModalVisible(false);
                    handleImagePick(true);
                  }}
                >
                  <Camera size={24} color={COLORS.accent} />
                  <Text style={styles.attachmentLabel}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.attachmentOption}
                  onPress={() => {
                    setGalleryModalVisible(false);
                    handleImagePick(false);
                  }}
                >
                  <ImageIcon size={24} color={COLORS.accent} />
                  <Text style={styles.attachmentLabel}>Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.attachmentOption}
                  onPress={handleLocationShare}
                >
                  <MapPin size={24} color={COLORS.accent} />
                  <Text style={styles.attachmentLabel}>Location</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>
      </View>
    </KeyboardAvoidingView>
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
    paddingTop: 45,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.surface,
    ...SHADOWS.card,
  },
  headerTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  providerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 2,
    fontFamily: 'Inter-SemiBold',
  },
  onlineStatus: {
    fontSize: 12,
    color: '#4CAF50',
    fontFamily: 'Inter-Regular',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.accent}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messagesContent: {
    padding: 16,
    gap: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.accent}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    backgroundColor: `${COLORS.accent}10`,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.accent}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.accent}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingTime: {
    position: 'absolute',
    top: -20,
    fontSize: 12,
    color: 'red',
    fontFamily: 'Inter-Medium',
  },
  attachmentsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    ...SHADOWS.card,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-end',
  },
  attachmentsContainerModal: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    ...SHADOWS.card,
  },
  attachmentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  attachmentOption: {
    alignItems: 'center',
    gap: 8,
  },
  attachmentLabel: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Medium',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.accent,
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Inter-Regular',
  },
  receivedMessageText: {
    color: COLORS.text.body,
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    alignSelf: 'flex-end',
    fontFamily: 'Inter-Regular',
  },
  receivedTimestamp: {
    color: COLORS.text.body,
    opacity: 0.7,
  },
});

// Also add MessageBubble component
const MessageBubble = ({ message }) => (
  <View
    style={[
      styles.messageBubble,
      message.isSent ? styles.sentMessage : styles.receivedMessage,
    ]}
  >
    <Text
      style={[
        styles.messageText,
        !message.isSent && styles.receivedMessageText,
      ]}
    >
      {message.text}
    </Text>
    <Text
      style={[styles.timestamp, !message.isSent && styles.receivedTimestamp]}
    >
      {message.timestamp.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}
    </Text>
  </View>
);
