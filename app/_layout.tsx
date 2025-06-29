import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { StyleSheet, View, Animated, Image, Text } from 'react-native';
import { SnackbarProvider } from '@/context/SnackbarContext';
import { TabBarProvider } from '@/context/TabBarContext';
import Head from 'expo-router/head';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function AnimatedSplashScreen({ onFinish }: { onFinish: () => void }) {
  const [fadeAnim] = useState(new Animated.Value(1));
  const [logoScale] = useState(new Animated.Value(1));
  const [textTranslateY] = useState(new Animated.Value(60));
  const [textOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();

    // Start logo zoom and text slide-in after short delay
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1.18,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 700,
          delay: 350,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 700,
          delay: 350,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 700,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      SplashScreen.hideAsync();
      onFinish();
    });
  }, []);

  return (
    <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
      <View style={styles.splashInner}>
        <Animated.Image
          source={require('../assets/images/icon.png')}
          style={[
            styles.splashLogo,
            { transform: [{ scale: logoScale }] },
          ]}
          resizeMode="contain"
        />
        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
            alignItems: 'center',
          }}
        >
          <Text style={styles.splashTitle}>ServeNear</Text>
          <Text style={styles.splashSubtitle}>Find trusted services nearby</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

export default function RootLayout() {
  const { isAuthenticated, loadAuthState } = useAuthStore();
  useFrameworkReady();

  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('@expo-google-fonts/inter/Inter_400Regular.ttf'),
    'Inter-Medium': require('@expo-google-fonts/inter/Inter_500Medium.ttf'),
    'Inter-SemiBold': require('@expo-google-fonts/inter/Inter_600SemiBold.ttf'),
    'Inter-Bold': require('@expo-google-fonts/inter/Inter_700Bold.ttf'),
  });

  // Move splashDone state and splash logic above any early returns
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    // Load authentication state
    loadAuthState();
  }, [loadAuthState]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash screen once fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while loading
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Splash animation must come after fonts are loaded
  if (!splashDone) {
    return <AnimatedSplashScreen onFinish={() => setSplashDone(true)} />;
  }

  return (
    <>
      <Head>
        <title>ServeNear - Local Service Marketplace</title>
        <meta name="description" content="Connect with trusted local service providers in your area. Find plumbers, electricians, cleaners, and more." />
        <meta name="keywords" content="local services, service providers, plumber, electrician, cleaner, handyman, home services" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="ServeNear - Local Service Marketplace" />
        <meta property="og:description" content="Connect with trusted local service providers in your area" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://servenear.entri.app" />
        <meta property="og:image" content="https://servenear.entri.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ServeNear - Local Service Marketplace" />
        <meta name="twitter:description" content="Connect with trusted local service providers in your area" />
        <meta name="twitter:image" content="https://servenear.entri.app/og-image.png" />
        <link rel="canonical" href="https://servenear.entri.app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#00CFE8" />
      </Head>
      
      <SnackbarProvider>
        <TabBarProvider>
          <GestureHandlerRootView style={styles.container}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen name="service/[id]" />
              <Stack.Screen name="category/[id]" />
              <Stack.Screen name="add-service" />
              <Stack.Screen name="cart" />
              <Stack.Screen name="schedule" />
            </Stack>
            <StatusBar style="auto" />
          </GestureHandlerRootView>
        </TabBarProvider>
      </SnackbarProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#008BB9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  splashInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 32,
    backgroundColor: 'white',
    padding: 12,
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  splashSubtitle: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Inter-Regular',
    opacity: 0.85,
    marginTop: 4,
    letterSpacing: 0.5,
  },
});