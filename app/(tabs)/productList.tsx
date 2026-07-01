import { Link } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useProductsViewModel } from '../../viewmodels/useProductViewModel';

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
          <Link href={{ pathname: '/product/[code]', params: { code: item.code } }} asChild>
            <Pressable style={styles.row}>
              <Text style={styles.name}>{item.product_name || 'Sans nom'}</Text>
              {item.brands ? <Text style={styles.brand}>{item.brands}</Text> : null}
              {item.nutriscore_grade ? (
                <Text style={styles.score}>Nutri-Score : {item.nutriscore_grade.toUpperCase()}</Text>
              ) : null}
            </Pressable>
          </Link>
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
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
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
  empty: {
    textAlign: 'center',
    marginTop: 32,
  },
  emptyLoader: {
    marginTop: 32,
  },
});
