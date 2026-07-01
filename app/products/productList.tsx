import { Link } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useProductsViewModel } from '../../viewmodels/useProductViewModel';
import { usePreferencesStore } from '../../stores/usePreferencesStore';
import { useFavoritesStore } from '../../stores/useFavoritesStore';
import { NutriscoreGrade } from '../../types/searchresult.type';

const GRADES: NutriscoreGrade[] = ['a', 'b', 'c', 'd', 'e'];

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

  // État global partagé via Zustand (sans passer par les props).
  const nutriscoreFilter = usePreferencesStore((s) => s.nutriscoreFilter);
  const setNutriscoreFilter = usePreferencesStore((s) => s.setNutriscoreFilter);
  const sortBy = usePreferencesStore((s) => s.sortBy);
  const setSortBy = usePreferencesStore((s) => s.setSortBy);

  const favorites = useFavoritesStore((s) => s.favorites);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un produit..."
        value={search}
        onChangeText={setSearch}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        <Chip
          label="Tous"
          active={nutriscoreFilter === null}
          onPress={() => setNutriscoreFilter(null)}
        />
        {GRADES.map((grade) => (
          <Chip
            key={grade}
            label={grade.toUpperCase()}
            active={nutriscoreFilter === grade}
            onPress={() => setNutriscoreFilter(nutriscoreFilter === grade ? null : grade)}
          />
        ))}
      </ScrollView>

      <Pressable
        style={styles.sortButton}
        onPress={() => setSortBy(sortBy === 'name' ? 'nutriscore' : 'name')}
      >
        <Text style={styles.sortText}>
          Tri : {sortBy === 'name' ? 'Nom' : 'Nutri-Score'}
        </Text>
      </Pressable>

      {isFetching && products.length > 0 ? (
        <ActivityIndicator style={styles.fetching} />
      ) : null}
      {isError && products.length === 0 ? (
        <Text style={styles.error}>
          Erreur : {error instanceof Error ? error.message : 'inconnue'}
        </Text>
      ) : null}
      <FlatList
        style={styles.list}
        data={products}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Link
              href={{ pathname: '/product/[code]', params: { code: item.code } }}
              asChild
            >
              <Pressable style={styles.rowInfo}>
                <Text style={styles.name}>{item.product_name || 'Sans nom'}</Text>
                {item.brands ? <Text style={styles.brand}>{item.brands}</Text> : null}
                {item.nutriscore_grade ? (
                  <Text style={styles.score}>Nutri-Score : {item.nutriscore_grade.toUpperCase()}</Text>
                ) : null}
              </Pressable>
            </Link>
            <Pressable
              style={styles.star}
              onPress={() => toggleFavorite(item.code)}
              hitSlop={8}
            >
              <Text style={styles.starIcon}>
                {favorites.includes(item.code) ? '★' : '☆'}
              </Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          showListLoader ? (
            <ActivityIndicator style={styles.emptyLoader} />
          ) : (
            <Text style={styles.empty}>
              {debouncedSearch ? 'Aucun produit trouvé' : 'Aucun produit'}
            </Text>
          )
        }
      />
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  chips: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  chipActive: {
    backgroundColor: '#2e7d32',
  },
  chipText: {
    color: '#333',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },
  sortButton: {
    alignSelf: 'flex-start',
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  sortText: {
    fontWeight: '600',
  },
  fetching: {
    marginBottom: 8,
  },
  error: {
    color: 'red',
    marginBottom: 8,
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
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    gap: 12,
  },
  rowInfo: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
  },
  brand: {
    color: '#666',
    marginTop: 2,
  },
  score: {
    marginTop: 4,
  },
  star: {
    paddingHorizontal: 4,
  },
  starIcon: {
    fontSize: 24,
    color: '#f5a623',
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
  },
  emptyLoader: {
    marginTop: 32,
  },
});
