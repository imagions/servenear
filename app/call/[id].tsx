import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Vibration,
  Platform,
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { router } from 'expo-router';
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

  useEffect(() => {
    // Start ripple animations
    const startRippleAnimation = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startRippleAnimation(rippleAnim1, 0);
    startRippleAnimation(rippleAnim2, 666);
    startRippleAnimation(rippleAnim3, 1333);

    // Start text animation
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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
        <View style={styles.avatarContainer}>
          {/* Ripple Effects */}
          {[rippleAnim1, rippleAnim2, rippleAnim3].map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                styles.ripple,
                {
                  transform: [{
                    scale: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 2],
                    })
                  }],
                  opacity: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.2, 0],
                  }),
                },
              ]}
            />
          ))}

          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JS</Text>
          </View>
        </View>

        {/* Call Info */}
        <Text style={styles.name}>John Smith</Text>
        <Animated.Text
          style={[
            styles.status,
            !isCallConnected && { opacity: textOpacity },
          ]}
        >
          {isCallConnected ? formatDuration(callDuration) : 'Calling...'}
        </Animated.Text>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, isSpeakerOn && styles.activeButton]}
            onPress={() => handleButtonPress(() => setIsSpeakerOn(!isSpeakerOn))}
          >
            <Volume2 color="white" size={24} />
            <Text style={styles.actionText}>Speaker</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, isMuted && styles.activeButton]}
            onPress={() => handleButtonPress(() => setIsMuted(!isMuted))}
          >
            <MicOff color="white" size={24} />
            <Text style={styles.actionText}>Mute</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.endCallButton}
            onPress={handleEndCall}
          >
            <PhoneOff color="white" size={32} />
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
    justifyContent: 'center',
    paddingTop: 64,
  },
  avatarContainer: {
    width: 240, // Twice the ripple size
    height: 240, // Twice the ripple size
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  ripple: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    top: '50%',
    left: '50%',
    marginLeft: -60, // Half the width
    marginTop: -60,  // Half the height
  },
  avatar: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Ensure avatar stays above ripples
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  status: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 64,
    fontFamily: 'Inter-Regular',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: 32,
    position: 'absolute',
    bottom: 48,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 30,
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
    borderRadius: 30,
  },
});
