import React from 'react';
import { View, ViewStyle } from 'react-native';

interface SafeAreaProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const SafeAreaView: React.FC<SafeAreaProps> = ({ children, style }) => (
  <View style={style}>{children}</View>
);

export const SafeAreaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => children;

export const useSafeAreaInsets = () => ({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
}); 