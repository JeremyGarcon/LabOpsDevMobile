import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="productList" options={{ title: 'Products' }} />
    </Tabs>
  );
}