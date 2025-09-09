import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingsItem = ({ title, subtitle }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  item: {
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
});

export default SettingsItem;