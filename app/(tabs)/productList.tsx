import { Link } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSearch } from '../../hooks/useSearch';

export default function ProductList() {
  const { data, isLoading, isError, error } = useSearch('search_terms=nutella&page_size=20');

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Erreur : {error instanceof Error ? error.message : 'inconnue'}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data?.products ?? []}
      keyExtractor={(item) => item.code}
      contentContainerStyle={styles.list}
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
      ListEmptyComponent={<Text style={styles.empty}>Aucun produit</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 16,
    gap: 12,
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
});
