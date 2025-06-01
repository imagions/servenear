import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { router } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { ArrowLeft, Mic, CirclePause as PauseCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function VoiceHelpScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
      stopRecording();
    };
  }, []);

  async function startRecording() {
    try {
      // Trigger haptic feedback on iOS/Android
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start timer
      const timer = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      setRecordingTimer(timer);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    
    // Trigger haptic feedback on iOS/Android
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Clear timer
    if (recordingTimer) {
      clearInterval(recordingTimer);
      setRecordingTimer(null);
    }
    
    setIsRecording(false);
    setIsProcessing(true);
    
    try {
      await recording.stopAndUnloadAsync();
      
      // Simulate AI transcription and processing
      setTimeout(() => {
        // Mock transcription results
        const mockTranscription = "I need someone to fix my leaking kitchen sink as soon as possible.";
        setTranscription(mockTranscription);
        
        // Mock category detection
        const mockCategories = ["Plumbing", "Home Repair", "Emergency"];
        setCategories(mockCategories);
        
        setIsProcessing(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to stop recording', err);
      setIsProcessing(false);
    }
    
    setRecording(null);
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function handleSubmit() {
    // Simulate submitting the request and navigating to results
    router.push('/explore?query=plumbing');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text.heading} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voice Help Request</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/3912956/pexels-photo-3912956.jpeg' }} 
            style={styles.illustration} 
          />
        </View>
        
        <Text style={styles.title}>
          {isRecording 
            ? "I'm listening..." 
            : transcription 
              ? "Here's what I heard" 
              : "What do you need help with?"}
        </Text>
        
        <Text style={styles.subtitle}>
          {isRecording 
            ? "Speak clearly and describe your service need" 
            : transcription 
              ? "Review and submit your request" 
              : "Press the button and describe what you need"}
        </Text>
        
        {isRecording && (
          <View style={styles.recordingInfo}>
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>Recording</Text>
            </View>
            <Text style={styles.recordingDuration}>{formatTime(recordingDuration)}</Text>
          </View>
        )}
        
        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.processingText}>Processing your request...</Text>
          </View>
        )}
        
        {transcription && !isProcessing && (
          <View style={styles.transcriptionContainer}>
            <Text style={styles.transcriptionText}>{transcription}</Text>
            
            <View style={styles.categoriesContainer}>
              <Text style={styles.categoriesLabel}>Detected Categories:</Text>
              <View style={styles.categories}>
                {categories.map((category, index) => (
                  <View key={index} style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{category}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit Request</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setTranscription('');
                setCategories([]);
              }}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {!transcription && !isProcessing && (
        <TouchableOpacity 
          style={[styles.recordButton, isRecording && styles.recordingButton]} 
          onPress={isRecording ? stopRecording : startRecording}
          activeOpacity={0.8}>
          {isRecording ? (
            <PauseCircle size={40} color="white" />
          ) : (
            <Mic size={40} color="white" />
          )}
        </TouchableOpacity>
      )}
    </View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 32,
    ...SHADOWS.card,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.body,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
  recordingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    marginBottom: 24,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF5252',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF5252',
    fontFamily: 'Inter-Medium',
  },
  recordingDuration: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5252',
    fontFamily: 'Inter-SemiBold',
  },
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  processingText: {
    fontSize: 16,
    color: COLORS.text.body,
    marginTop: 16,
    fontFamily: 'Inter-Regular',
  },
  transcriptionContainer: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 20,
    marginTop: 16,
    ...SHADOWS.card,
  },
  transcriptionText: {
    fontSize: 16,
    color: COLORS.text.body,
    lineHeight: 24,
    marginBottom: 20,
    fontFamily: 'Inter-Regular',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.body,
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryTag: {
    backgroundColor: 'rgba(0, 207, 232, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  submitButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  retryButton: {
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButtonText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  recordButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  recordingButton: {
    backgroundColor: '#FF5252',
  },
});