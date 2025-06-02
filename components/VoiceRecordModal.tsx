import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Modal, Pressable } from 'react-native';
import { COLORS, SHADOWS } from '@/constants/theme';
import { Mic } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

const RECORD_LIMIT = 15000; // 15 seconds

export default function VoiceRecordModal({ visible, onClose, onSubmit }) {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(RECORD_LIMIT / 1000);
  const [hasRecording, setHasRecording] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const recording = useRef(null);
  const timer = useRef(null);
  const progressAnimation = useRef(null);

  useEffect(() => {
    // Reset state when modal becomes visible
    if (visible) {
      setTimeLeft(RECORD_LIMIT / 1000);
      setHasRecording(false);
      progressAnim.setValue(0);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
      if (progressAnimation.current) progressAnimation.current.stop();
    };
  }, [visible]);

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
      setTimeLeft(RECORD_LIMIT / 1000);

      // Start progress animation
      progressAnimation.current = Animated.timing(progressAnim, {
        toValue: 1,
        duration: RECORD_LIMIT,
        useNativeDriver: false,
      });
      progressAnimation.current.start();

      // Start countdown timer
      timer.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
      if (progressAnimation.current) {
        progressAnimation.current.stop();
      }
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      if (recording.current) {
        await recording.current.stopAndUnloadAsync();
        setHasRecording(true);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
    setIsRecording(false);
  };

  const handleSubmit = async () => {
    if (recording.current) {
      const uri = recording.current.getURI();
      onSubmit(uri);
      onClose();
    }
  };

  const formatTime = (seconds) => {
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  };

  const getProgressRotation = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

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
                transform: [{ rotate: getProgressRotation }]
              }
            ]}>
              <View style={styles.progressIndicator} />
            </Animated.View>
            
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

          {isRecording && (
            <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
          )}

          {hasRecording && (
            <Pressable style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit</Text>
            </Pressable>
          )}

          <Text style={styles.hint}>
            {isRecording 
              ? 'Release to stop recording'
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
  progressIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
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
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
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