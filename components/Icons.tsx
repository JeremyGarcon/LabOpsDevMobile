import React from 'react';
import { Text, View } from 'react-native';

export const ProductsIcon = ({ focused }: { focused: boolean }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 24 }}>📦</Text>
  </View>
);

export const ProfileIcon = ({ focused }: { focused: boolean }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 24 }}>👤</Text>
  </View>
);

export const BackArrowIcon = () => (
  <Text style={{ fontSize: 18 }}>←</Text>
);
