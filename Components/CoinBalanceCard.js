import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CoinBalanceCard = ({ username, coins }) => (
  <View style={styles.card}>
    <Text style={styles.username}>{username}</Text>
    <Text style={styles.coins}>Coins: {coins}</Text>
    <View style={styles.actions}>
      <TouchableOpacity><Text style={styles.link}>Earn Coins</Text></TouchableOpacity>
      <TouchableOpacity><Text style={styles.link}>Redeem Coins</Text></TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
  coins: {
    fontSize: 14,
    marginVertical: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  link: {
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default CoinBalanceCard;