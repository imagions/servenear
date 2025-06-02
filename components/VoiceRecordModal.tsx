import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Modal, Pressable } from 'react-native';
import { COLORS, SHADOWS } from '@/constants/theme';
import { Mic } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av'; // Changed from expo-audio to expo-av

const RECORD_LIMIT = 15000; // 15 seconds

export default function VoiceRecordModal({ visible, onClose, onSubmit }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const recording = useRef(null);
  const timer = useRef(null);

  const startRecording = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      recording.current = newRecording;
      setIsRecording(true);

      // Start progress animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: RECORD_LIMIT,
        useNativeDriver: false,
      }).start();

      // Start timer
      let startTime = Date.now();
      timer.current = setInterval(() => {
        const duration = Date.now() - startTime;
        setRecordingDuration(duration);
        if (duration >= RECORD_LIMIT) {
          stopRecording();
        }
      }, 100);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (recording.current) {
        await recording.current.stopAndUnloadAsync();
        setHasRecording(true);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
    clearInterval(timer.current);
    setIsRecording(false);
    progressAnim.setValue(0);
  };

  const handleSubmit = async () => {
    if (recording.current) {
      const uri = recording.current.getURI();
      onSubmit(uri);
      onClose();
      // Show success snackbar handled by parent
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            {isRecording ? 'Recording...' : hasRecording ? 'Ready to submit' : 'Hold to record'}
          </Text>
          
          <View style={styles.recordButton}>
            <Animated.View style={[
              styles.progressRing,
              {
                borderColor: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [COLORS.accent + '40', COLORS.accent]
                })
              }
            ]} />
            
            <Pressable
              onPressIn={!hasRecording ? startRecording : null}
              onPressOut={isRecording ? stopRecording : null}
              style={[
                styles.micButton,
                isRecording && styles.recordingButton
              ]}
            >
              <Mic size={32} color="white" />
            </Pressable>
          </View>

          {hasRecording && (
            <Pressable style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit</Text>
            </Pressable>
          )}

          <Text style={styles.hint}>
            {isRecording 
              ? `${Math.round(recordingDuration / 1000)}s / ${RECORD_LIMIT/1000}s`
              : hasRecording 
                ? 'Tap submit to continue'
                : 'Press and hold to record'}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 24,
    fontFamily: 'Inter-SemiBold',
  },
  recordButton: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.accent + '40',
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  recordingButton: {
    backgroundColor: '#FF5252',
    transform: [{ scale: 1.1 }],
  },
  submitButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 16,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  hint: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
});
