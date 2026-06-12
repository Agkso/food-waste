import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FoodProvider } from '@/context/FoodContext';
import { hasSeenOnboarding } from '@/services/onboarding';
import { colors } from '@/theme';

function OnboardingGate() {
  const router = useRouter();

  useEffect(() => {
    hasSeenOnboarding().then((seen) => {
      if (!seen) router.replace('/onboarding');
    });
  }, [router]);

  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <FoodProvider>
        <StatusBar style="light" />
        <OnboardingGate />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700' },
            headerTitleAlign: 'center',
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="scan" options={{ title: 'Escanear alimento', headerShown: false }} />
          <Stack.Screen name="add" options={{ title: 'Adicionar item' }} />
          <Stack.Screen name="item/[id]" options={{ title: 'Detalhes do item' }} />
        </Stack>
      </FoodProvider>
    </SafeAreaProvider>
  );
}
