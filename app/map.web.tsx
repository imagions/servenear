import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MapWebFallback() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map view is not available on web.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    margin: 16,
    borderRadius: 8,
  },
  text: {
    color: '#444',
    fontSize: 16,
  },
});
