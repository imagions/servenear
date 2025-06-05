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
    <SnackbarProvider>
      <TabBarProvider>
        <GestureHandlerRootView style={styles.container}>
          <Stack screenOptions={{ headerShown: false }}>
            {/* {!isAuthenticated ? (
          <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        ) : (
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        )} */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});