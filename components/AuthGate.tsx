import { useEffect, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export function AuthGate({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    const inAuthGroup = segments[0] === '(auth)';

    if (status === 'unauthenticated' && !inAuthGroup) {
      router.replace('/(auth)/login');
      return;
    }

    if (status === 'authenticated' && inAuthGroup) {
      router.replace('/(tabs)/productList');
    }
  }, [status, segments, router]);

  if (status === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
