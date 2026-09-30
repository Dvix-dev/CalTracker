import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AppProvider, useApp } from '@/store/AppProvider';
import { useColors } from '@/components/ui';

function RootNavigator() {
  const { ready, onboardingComplete } = useApp();
  const segments = useSegments();
  const colors = useColors();
  useEffect(() => {
    if (!ready) return;
    const onOnboarding = segments[0] === 'onboarding';
    if (!onboardingComplete && !onOnboarding) router.replace('/onboarding');
    if (onboardingComplete && onOnboarding) router.replace('/(tabs)');
  }, [ready, onboardingComplete, segments]);
  if (!ready) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}><ActivityIndicator color={colors.primary} /></View>;
  return <><StatusBar style={colors.text === '#F1F5F2' ? 'light' : 'dark'} /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}><Stack.Screen name="onboarding" /><Stack.Screen name="(tabs)" /><Stack.Screen name="add-food" options={{ presentation: 'modal' }} /></Stack></>;
}
export default function RootLayout() { return <AppProvider><RootNavigator /></AppProvider>; }
