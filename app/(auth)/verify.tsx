import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';

export default function VerifyScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [countdown, setCountdown] = useState(30);
  const { login } = useAuthStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpValue = otp.join('');
    
    // For demo purposes
    if (otpValue === '2244') {
      login();
      router.replace('/');
    } else {
      Alert.alert('Error', 'Invalid OTP. For demo, use 2244');
    }
  };

  const handleResend = () => {
    setCountdown(30);
    Alert.alert('OTP Sent', 'A new OTP has been sent to your phone.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          We've sent a verification code to your phone number
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={[
            styles.verifyButton, 
            otp.every(digit => digit !== '') ? {} : styles.disabledButton
          ]} 
          onPress={handleVerify}
          disabled={otp.some(digit => digit === '')}>
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          {countdown > 0 ? (
            <Text style={styles.countdownText}>Resend in {countdown}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendButton}>Resend</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
        
        <View style={styles.demoContainer}>
          <Text style={styles.demoText}>Demo OTP: 2244</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    justifyContent: 'center',
  },
  content: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 24,
    ...SHADOWS.card,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.body,
    marginBottom: 32,
    fontFamily: 'Inter-Regular',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpInput: {
    width: 64,
    height: 64,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#F5F5F5',
    fontFamily: 'Inter-SemiBold',
  },
  verifyButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: 'rgba(0, 207, 232, 0.5)',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  resendText: {
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  countdownText: {
    color: '#9E9E9E',
    fontFamily: 'Inter-Regular',
  },
  resendButton: {
    color: COLORS.accent,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  backButton: {
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.text.body,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  demoContainer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    alignItems: 'center',
  },
  demoText: {
    color: COLORS.accent,
    fontFamily: 'Inter-Medium',
  },
});