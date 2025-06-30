import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const { login } = useAuthStore();

  const handleContinue = () => {
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    
    // For demo purposes, allow login with demo phone number
    if (phone.trim() === '1234567890') {
      router.push('/verify');
    } else {
      router.push('/verify');
    }
  };

  const handleDemoLogin = () => {
    // Set demo phone number
    setPhone('1234567890');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=400&auto=compress&cs=tinysrgb' }} 
          style={styles.headerImage}
        />
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>ServeNear</Text>
        </View>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneInput}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={phone}
              placeholderTextColor="#9E9E9E"
              onChangeText={setPhone}
              maxLength={10}
            />
          </View>
        </View>
        
        <TouchableOpacity activeOpacity={0.7} style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
        
        <View style={styles.orContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.divider} />
        </View>
        
        <View style={styles.socialButtons}>
          <TouchableOpacity activeOpacity={0.7} style={styles.socialButton}>
            <MaterialIcons name="email" size={24} color="#4285F4" />
            <Text style={styles.socialButtonText}>Email</Text>
          </TouchableOpacity>
          
          <TouchableOpacity activeOpacity={0.7} style={styles.socialButton}>
            <MaterialIcons name="facebook" size={24} color="#4267B2" />
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
          
          <TouchableOpacity activeOpacity={0.7} style={styles.socialButton}>
            <MaterialIcons name="login" size={24} color="#000000" />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity activeOpacity={0.7} style={styles.demoButton} onPress={handleDemoLogin}>
          <Text style={styles.demoButtonText}>Use Demo Account (1234567890)</Text>
        </TouchableOpacity>
        
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/signup')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: '30%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  logoContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -20 }],
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: RADIUS.card,
    padding: 16,
    ...SHADOWS.card,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.body,
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
    color: COLORS.text.body,
    fontFamily: 'Inter-Medium',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  continueButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    marginHorizontal: 16,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  socialButtonText: {
    marginLeft: 8,
    color: COLORS.text.body,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  demoButton: {
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  demoButtonText: {
    color: COLORS.accent,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signupText: {
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  signupLink: {
    color: COLORS.accent,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});