import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Vibration,
  Platform,
  Image,
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { Volume2, MicOff, PhoneOff, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function CallScreen() {
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const rippleAnim1 = useRef(new Animated.Value(0)).current;
  const rippleAnim2 = useRef(new Animated.Value(0)).current;
  const rippleAnim3 = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0.4)).current;

  const params = useLocalSearchParams();
  const providerName = params.name || 'Unknown Provider';
  const providerImage = params.providerImage || '';

  useEffect(() => {
    // Start ripple animations - don't stop them here
    const startRippleAnimation = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            // Add reset animation
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startRippleAnimation(rippleAnim1, 0);
    startRippleAnimation(rippleAnim2, 666);
    startRippleAnimation(rippleAnim3, 1333);

    // Only start opacity animation for "Calling..." text
    Animated.loop(
      Animated.sequence([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulate call pickup after 5 seconds
    const pickupTimer = setTimeout(() => {
      handleCallConnect();
    }, 5000);

    return () => {
      clearTimeout(pickupTimer);
    };
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isCallConnected) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCallConnected]);

  const handleCallConnect = () => {
    setIsCallConnected(true);

    // Stop ripple animations when call connects
    Animated.parallel([
      Animated.timing(rippleAnim1, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(rippleAnim2, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(rippleAnim3, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Trigger heavy haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      Vibration.vibrate(400);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleButtonPress = (action: () => void) => {
    // Trigger medium haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Vibration.vibrate(100);
    }
    action();
  };

  const handleEndCall = () => {
    // Trigger heavy haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      Vibration.vibrate(200);
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <View style={styles.rippleContainer}>
            {/* Ripple Effects */}
            {[rippleAnim1, rippleAnim2, rippleAnim3].map((anim, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.ripple,
                  {
                    transform: [
                      {
                        scale: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 2],
                        }),
                      },
                    ],
                    opacity: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.2, 0],
                    }),
                  },
                ]}
              />
            ))}

            {/* Avatar */}
            {providerImage ? (
              <Image source={{ uri: providerImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {providerName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </Text>
              </View>
            )}
          </View>

          {/* Call Info */}
          <View style={styles.callInfo}>
            <Text style={styles.name}>{providerName}</Text>
            <Animated.Text
              style={[
                styles.status,
                !isCallConnected && { opacity: textOpacity },
              ]}
            >
              {isCallConnected ? formatDuration(callDuration) : 'Calling...'}
            </Animated.Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={[styles.actionButton, isSpeakerOn && styles.activeButton]}
              onPress={() =>
                handleButtonPress(() => setIsSpeakerOn(!isSpeakerOn))
              }
            >
              <Volume2 color="white" size={24} />
            </TouchableOpacity>
            <Text style={styles.actionText}>Speaker</Text>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={[styles.actionButton, isMuted && styles.activeButton]}
              onPress={() => handleButtonPress(() => setIsMuted(!isMuted))}
            >
              <MicOff color="white" size={24} />
            </TouchableOpacity>
            <Text style={styles.actionText}>Mute</Text>
          </View>
          <TouchableOpacity
            style={styles.endCallButton}
            onPress={handleEndCall}
          >
            <PhoneOff color="white" size={25} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.accent,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 120, // Increased top padding
    paddingBottom: 48,
  },
  rippleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ripple: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'white',
    top: '50%',
    left: '50%',
    marginLeft: -80,
    marginTop: -80,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
  callInfo: {
    marginTop: 24,
    alignItems: 'center',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  status: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter-Regular',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 32,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 50,
  },
  activeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionText: {
    color: 'white',
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  endCallButton: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 50,
  },
});
