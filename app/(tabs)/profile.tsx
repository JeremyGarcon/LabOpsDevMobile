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
      <View style={styles.centered} accessibilityLabel="Chargement du profil" accessible>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const profileSummary = [
    user?.firstName && `Prénom ${user.firstName}`,
    user?.name && `Nom ${user.name}`,
    user?.email && `Email ${user.email}`,
    user?.role && `Rôle ${user.role}`,
    user?.account_checked !== undefined &&
      `Compte ${user.account_checked ? 'vérifié' : 'non vérifié'}`,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Profil
      </Text>

      <View
        style={styles.card}
        accessible
        accessibilityLabel={profileSummary || 'Informations du profil non disponibles'}
      >
        <Text style={styles.label} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          Prénom
        </Text>
        <Text style={styles.value} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {user?.firstName || '—'}
        </Text>

        <Text style={styles.label} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          Nom
        </Text>
        <Text style={styles.value} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {user?.name || '—'}
        </Text>

        <Text style={styles.label} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          Email
        </Text>
        <Text style={styles.value} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {user?.email || '—'}
        </Text>

        {user?.role ? (
          <>
            <Text style={styles.label} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              Rôle
            </Text>
            <Text style={styles.value} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              {user.role}
            </Text>
          </>
        ) : null}

        {user?.account_checked !== undefined ? (
          <>
            <Text style={styles.label} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              Compte vérifié
            </Text>
            <Text style={styles.value} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              {user.account_checked ? 'Oui' : 'Non'}
            </Text>
          </>
        ) : null}
      </View>

      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}

      <Pressable
        style={[styles.button, styles.secondaryButton, isRefreshing && styles.buttonDisabled]}
        onPress={handleRefresh}
        disabled={isRefreshing}
        accessibilityRole="button"
        accessibilityLabel="Rafraîchir le profil"
        accessibilityState={{ disabled: isRefreshing, busy: isRefreshing }}
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
        accessibilityRole="button"
        accessibilityLabel="Se déconnecter"
        accessibilityHint="Ferme votre session"
        accessibilityState={{ disabled: isLoggingOut, busy: isLoggingOut }}
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
