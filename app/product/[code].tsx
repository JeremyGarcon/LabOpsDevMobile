import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useProductDetailViewModel } from '../../viewmodels/useProductViewModel';

export default function ProductDetail() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { product, showLoader, isError, error } = useProductDetailViewModel(code);

  if (showLoader) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#007AFF" />
      </View>
    );
  }

  if (isError && !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Erreur : {error instanceof Error ? error.message : 'produit introuvable'}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Produit introuvable</Text>
      </View>
    );
  }

  const nutriments = product.nutriments ?? {};
  const imageUri = product.image_front_url || product.image_url || product.image_small_url || product.image_thumb_url;

  return (
    <>
      <Stack.Screen options={{ title: product.product_name || 'Produit' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <View style={styles.imageWrap}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>Photo</Text>
              </View>
            )}
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.eyebrow}>Produit</Text>
            <Text style={styles.title}>{product.product_name || 'Sans nom'}</Text>
            {product.brands ? <Text style={styles.brand}>{product.brands}</Text> : null}
            {product.nutriscore_grade ? (
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>Nutri-Score {product.nutriscore_grade.toUpperCase()}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Informations</Text>
          {product.quantity ? <Info label="Quantité" value={product.quantity} /> : null}
          {product.categories ? <Info label="Catégories" value={product.categories} /> : null}
          {product.nutriscore_grade ? (
            <Info label="Nutri-Score" value={product.nutriscore_grade.toUpperCase()} />
          ) : null}
        </View>

        {product.ingredients_text ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Ingrédients</Text>
            <Text style={styles.bodyText}>{product.ingredients_text}</Text>
          </View>
        ) : null}

        <View style={styles.sectionCard}>
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
    <View
      style={styles.infoRow}
      accessible
      accessibilityLabel={`${label} : ${value}`}
    >
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
    backgroundColor: '#f4f7fb',
  },
  container: {
    padding: 16,
    gap: 16,
    backgroundColor: '#f4f7fb',
    paddingBottom: 28,
  },
  heroCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  imageWrap: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#EEF4FF',
    marginBottom: 14,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF4FF',
  },
  imagePlaceholderText: {
    color: '#007AFF',
    fontWeight: '700',
  },
  heroContent: {
    gap: 6,
  },
  eyebrow: {
    color: '#007AFF',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#14213D',
  },
  brand: {
    fontSize: 14,
    color: '#6B7280',
  },
  scoreBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAF4FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 4,
  },
  scoreText: {
    color: '#007AFF',
    fontWeight: '700',
    fontSize: 12,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#14213D',
    marginBottom: 8,
  },
  bodyText: {
    color: '#4B5563',
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  infoLabel: {
    color: '#6B7280',
  },
  infoValue: {
    fontWeight: '600',
    color: '#14213D',
    flexShrink: 1,
    textAlign: 'right',
  },
  error: {
    color: '#D64545',
    fontWeight: '600',
    textAlign: 'center',
  },
});
