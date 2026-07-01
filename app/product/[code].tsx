import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useProductDetailViewModel } from '../../viewmodels/useProductViewModel';
import { useFavoritesStore } from '../../stores/useFavoritesStore';

export default function ProductDetail() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { product, showLoader, isError, error } = useProductDetailViewModel(code);

  // Même store Zustand que la liste : l'état favori est partagé entre les écrans.
  const favorites = useFavoritesStore((s) => s.favorites);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = !!code && favorites.includes(code);

  if (showLoader) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError && !product) {
    return (
      <View style={styles.center}>
        <Text>Erreur : {error instanceof Error ? error.message : 'produit introuvable'}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Produit introuvable</Text>
      </View>
    );
  }

  const nutriments = product.nutriments ?? {};

  return (
    <>
      <Stack.Screen options={{ title: product.product_name || 'Produit' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{product.product_name || 'Sans nom'}</Text>
          <Pressable onPress={() => toggleFavorite(code)} hitSlop={8}>
            <Text style={styles.starIcon}>{isFavorite ? '★' : '☆'}</Text>
          </Pressable>
        </View>
        {product.brands ? <Text style={styles.brand}>{product.brands}</Text> : null}

        <View style={styles.section}>
          {product.quantity ? <Info label="Quantité" value={product.quantity} /> : null}
          {product.categories ? <Info label="Catégories" value={product.categories} /> : null}
          {product.nutriscore_grade ? (
            <Info label="Nutri-Score" value={product.nutriscore_grade.toUpperCase()} />
          ) : null}
        </View>

        {product.ingredients_text ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingrédients</Text>
            <Text>{product.ingredients_text}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Valeurs nutritionnelles (pour 100g)</Text>
          <Info label="Énergie" value={fmt(nutriments['energy-kcal_100g'], 'kcal')} />
          <Info label="Matières grasses" value={fmt(nutriments.fat_100g, 'g')} />
          <Info label="dont saturées" value={fmt(nutriments['saturated-fat_100g'], 'g')} />
          <Info label="Glucides" value={fmt(nutriments.carbohydrates_100g, 'g')} />
          <Info label="dont sucres" value={fmt(nutriments.sugars_100g, 'g')} />
          <Info label="Protéines" value={fmt(nutriments.proteins_100g, 'g')} />
          <Info label="Sel" value={fmt(nutriments.salt_100g, 'g')} />
          <Info label="Fibres" value={fmt(nutriments.fiber_100g, 'g')} />
        </View>
      </ScrollView>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function fmt(value: number | undefined, unit: string): string {
  return value === undefined ? '—' : `${value} ${unit}`;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: 16,
    gap: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
  },
  starIcon: {
    fontSize: 28,
    color: '#f5a623',
  },
  brand: {
    fontSize: 16,
    color: '#666',
    marginTop: -8,
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  infoLabel: {
    color: '#444',
  },
  infoValue: {
    fontWeight: '500',
  },
});
