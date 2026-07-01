import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useProfileViewModel } from '../../viewmodels/useProfileViewModel';

export default function ProfileScreen() {
  const {
    user,
    isLoading,
    isLoggingOut,
    isRefreshing,
    error,
    handleLogout,
    handleRefresh,
  } = useProfileViewModel();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Prénom</Text>
        <Text style={styles.value}>{user?.firstName || '—'}</Text>

        <Text style={styles.label}>Nom</Text>
        <Text style={styles.value}>{user?.name || '—'}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email || '—'}</Text>

        {user?.role ? (
          <>
            <Text style={styles.label}>Rôle</Text>
            <Text style={styles.value}>{user.role}</Text>
          </>
        ) : null}

        {user?.account_checked !== undefined ? (
          <>
            <Text style={styles.label}>Compte vérifié</Text>
            <Text style={styles.value}>{user.account_checked ? 'Oui' : 'Non'}</Text>
          </>
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.button, styles.secondaryButton, isRefreshing && styles.buttonDisabled]}
        onPress={handleRefresh}
        disabled={isRefreshing}
      >
        {isRefreshing ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.secondaryButtonText}>Rafraîchir</Text>
        )}
      </Pressable>

      <Pressable
        style={[styles.button, styles.logoutButton, isLoggingOut && styles.buttonDisabled]}
        onPress={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Se déconnecter</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    color: 'red',
  },
  button: {
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
