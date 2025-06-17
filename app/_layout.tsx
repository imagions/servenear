import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { StyleSheet } from 'react-native';
import { SnackbarProvider } from '@/context/SnackbarContext';
import { TabBarProvider } from '@/context/TabBarContext';
import Head from 'expo-router/head';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

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
        <meta property="og:url" content="https://servenear.app" />
        <meta property="og:image" content="https://servenear.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ServeNear - Local Service Marketplace" />
        <meta name="twitter:description" content="Connect with trusted local service providers in your area" />
        <meta name="twitter:image" content="https://servenear.app/og-image.png" />
        <link rel="canonical" href="https://servenear.app" />
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
});