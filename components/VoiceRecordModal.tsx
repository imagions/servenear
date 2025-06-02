import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  Easing,
  withSpring,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, SHADOWS } from '@/constants/theme';
import { Mic, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RECORD_LIMIT = 15000;
const CIRCLE_LENGTH = Math.PI * 2 * 47; // 2πr

export default function VoiceRecordModal({ visible, onClose, onSubmit }) {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(RECORD_LIMIT / 1000);
  const [hasRecording, setHasRecording] = useState(false);
  const recording = useRef(null);
  const timer = useRef(null);
  const progressAnimation = useRef(null);

  // Replace Animated.Value with useSharedValue
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setTimeLeft(RECORD_LIMIT / 1000);
      setHasRecording(false);
      progress.value = 0;
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [visible]);

  // Use animatedProps for the circle animation
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
  }));

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
      progress.value = 0;
      progressAnimation.current = withTiming(1, {
        duration: RECORD_LIMIT,
        easing: Easing.linear,
      });
      progress.value = progressAnimation.current;

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

      // Stop the animation at current position
      if (progressAnimation.current) {
        cancelAnimation(progress);
      }

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

  const resetState = () => {
    setIsRecording(false);
    setTimeLeft(RECORD_LIMIT / 1000);
    setHasRecording(false);
    progress.value = 0; // Only reset progress when starting a new recording
    if (recording.current) {
      recording.current = null;
    }
  };

  const handlePressIn = () => {
    if (!isRecording) {
      resetState();
      startRecording();
    }
  };

  const handlePressOut = () => {
    if (isRecording) {
      stopRecording();
    }
  };

  const formatTime = (seconds) => {
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(
      Math.floor(seconds % 60)
    ).padStart(2, '0')}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.modalContainer}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={styles.modalContent}
        >
          <Text style={styles.title}>
            {isRecording
              ? 'Recording...'
              : hasRecording
              ? 'Perfect! Ready to submit?'
              : 'Hold to record your request'}
          </Text>

          <View style={styles.recordButton}>
            <Svg width={120} height={120}>
              {/* Background Circle */}
              <Circle
                cx={60}
                cy={60}
                r={47}
                stroke={COLORS.accent + '20'}
                strokeWidth={4}
                fill="transparent"
                transform="rotate(-90, 60, 60)"
              />
              {/* Progress Circle */}
              <AnimatedCircle
                cx={60}
                cy={60}
                r={47}
                stroke={COLORS.accent}
                strokeWidth={4}
                fill="transparent"
                strokeDasharray={CIRCLE_LENGTH}
                animatedProps={animatedProps}
                strokeLinecap="round"
                transform="rotate(-90, 60, 60)"
              />
            </Svg>

            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={[styles.micButton, isRecording && styles.recordingButton]}
            >
              <Mic size={32} color="white" />
              {isRecording && (
                <Text style={styles.timerText}>{Math.floor(timeLeft)}s</Text>
              )}
            </Pressable>
          </View>

          <Pressable
            style={[
              styles.submitButton,
              {
                backgroundColor: !hasRecording
                  ? COLORS.disabledSubmit
                  : COLORS.accent,
              },
            ]}
            onPress={handleSubmit}
            disabled={!hasRecording}
          >
            <Text style={styles.submitText}>Submit Recording</Text>
          </Pressable>

          <Text style={styles.hint}>
            {isRecording
              ? 'Release to stop recording'
              : hasRecording
              ? 'Press and hold mic to re-record'
              : 'Press and hold the mic button'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
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
  micButton: {
    position: 'absolute',
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
  timerText: {
    position: 'absolute',
    bottom: -24,
    color: COLORS.text.heading,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  submitButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 16,
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  submitTextDisabled: {
    color: '#9E9E9E',
  },
  hint: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
});
