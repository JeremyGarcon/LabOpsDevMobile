import { Link } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useProductsViewModel } from '../../viewmodels/useProductViewModel';
import { getNutriscoreColor } from '../../utils/nutriscoreColors';

export default function ProductList() {
  const {
    products,
    search,
    setSearch,
    debouncedSearch,
    isFetching,
    isError,
    error,
    showListLoader,
  } = useProductsViewModel();

  const imageSource = (item: { image_front_url?: string; image_url?: string; image_small_url?: string; image_thumb_url?: string }) =>
    item.image_front_url || item.image_url || item.image_small_url || item.image_thumb_url;

  return (
    <View style={styles.container}>
      <View style={styles.header} accessible accessibilityLabel={`Catalogue, ${products.length} produits`}>
        <View style={styles.headerContent}>
          <Text style={styles.eyebrow} accessibilityRole="header">Catalogue</Text>
          <Text style={styles.title} accessibilityRole="header">Trouvez vos produits</Text>
          <Text style={styles.subtitle}>Parcourez les produits et leurs infos nutritionnelles.</Text>
        </View>
        <View style={styles.badge} accessible accessibilityLabel={`${products.length} produits disponibles`}>
          <Text style={styles.badgeText}>{products.length}</Text>
        </View>
      </View>

      <View style={styles.searchCard}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un produit..."
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          clearButtonMode="while-editing"
          placeholderTextColor="#8E9AAF"
          accessible
          accessibilityLabel="Recherche"
          accessibilityHint="Saisissez le nom d'un produit à rechercher"
        />
      </View>

      {isFetching && products.length > 0 ? (
        <ActivityIndicator style={styles.fetching} color="#007AFF" accessible accessibilityLabel="Chargement des résultats" />
      ) : null}

      {isError && products.length === 0 ? (
        <Text style={styles.error}>Erreur : {error instanceof Error ? error.message : 'inconnue'}</Text>
      ) : null}

      <FlatList
        style={styles.list}
        data={products}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const uri = imageSource(item);
          const nutriscoreColor = getNutriscoreColor(item.nutriscore_grade);
          return (
            <Link href={{ pathname: '/product/[code]', params: { code: item.code } }} asChild>
              <Pressable
                style={styles.row}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`${item.product_name || 'Produit'} - ${item.brands || ''}`.trim()}
                accessibilityHint="Ouvre la fiche produit"
              >
                <View style={styles.imageWrap}>
                  {uri ? (
                    <Image source={{ uri }} style={styles.image} resizeMode="cover" accessible accessibilityLabel={`${item.product_name || 'Produit'} image`} />
                  ) : (
                    <View style={styles.imagePlaceholder} accessible accessibilityLabel="Image indisponible">
                      <Text style={styles.imagePlaceholderText}>Photo</Text>
                    </View>
                  )}
                </View>
                <View style={styles.rowContent}>
                  <Text style={styles.name}>{item.product_name || 'Sans nom'}</Text>
                  {item.brands ? <Text style={styles.brand}>{item.brands}</Text> : null}
                  {item.nutriscore_grade ? (
                    <View style={styles.scoreContainer}>
                      <View
                        style={[
                          styles.scoreIndicator,
                          { backgroundColor: nutriscoreColor },
                        ]}
                        accessible
                        accessibilityLabel={`Nutri-Score ${item.nutriscore_grade.toUpperCase()}`}
                      >
                        <Text style={styles.scoreIndicatorText}>{item.nutriscore_grade.toUpperCase()}</Text>
                      </View>
                      <Text style={styles.scoreLabel}>Nutri-Score</Text>
                    </View>
                  ) : null}
                </View>
              </Pressable>
            </Link>
          );
        }}
        ListEmptyComponent={
          showListLoader ? (
            <ActivityIndicator style={styles.emptyLoader} color="#007AFF" accessible accessibilityLabel="Chargement des produits" />
          ) : (
            <View style={styles.emptyState}>
              <View accessible accessibilityLabel={debouncedSearch ? 'Aucun produit trouvé' : 'Aucun produit'}>
                <Text style={styles.empty}>
                  {debouncedSearch ? 'Aucun produit trouvé' : 'Aucun produit'}
                </Text>
              </View>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#f4f7fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 12,
  },
  headerContent: {
    flex: 1,
  },
  eyebrow: {
    color: '#007AFF',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#14213D',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  badge: {
    minWidth: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  searchInput: {
    height: 44,
    borderColor: '#DCE3F0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    color: '#14213D',
  },
  fetching: {
    marginBottom: 8,
  },
  error: {
    color: '#D64545',
    marginBottom: 8,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 12,
    paddingBottom: 16,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  imageWrap: {
    width: 74,
    height: 74,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#EEF4FF',
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
  rowContent: {
    flex: 1,
  },
  name: {
    fontWeight: '700',
    fontSize: 15,
    color: '#14213D',
    marginBottom: 2,
  },
  brand: {
    color: '#6B7280',
    marginTop: 2,
    fontSize: 12,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  scoreIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreIndicatorText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
  },
  scoreLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyState: {
    paddingTop: 28,
    alignItems: 'center',
  },
  empty: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
  },
  emptyLoader: {
    marginTop: 28,
  },
});
