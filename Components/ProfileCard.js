import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export function ProfileCard({ username, planLabel, coins, onEarn, onRedeem }) {
  const initials = username?.[0]?.toUpperCase() ?? "U";

  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.header}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        {/* Username + Plan */}
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.planLabel}>{planLabel}</Text>
        </View>

        {/* Coins pill */}
        <View style={styles.coinsPill}>
          <Text style={styles.coinsText}>{coins} Coins</Text>
        </View>
      </View>

      {/* CTA buttons */}
      <View style={styles.buttonsContainer}>
        <Pressable
          onPress={onEarn}
          style={styles.earnButton}
        >
          <Text style={styles.buttonText}>Earn Coins</Text>
        </Pressable>

        <Pressable
          onPress={onRedeem}
          style={styles.redeemButton}
        >
          <Text style={styles.redeemButtonText}>Redeem Coins</Text>
        </Pressable>
      </View>

      {/* Helper text */}
      <Text style={styles.helperText}>
        Use coins to unlock exciting deals and digital coupons.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#23232D",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "700",
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700",
  },
  planLabel: {
    color: "#666666",
    fontSize: 12,
    marginTop: 2,
  },
  coinsPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: "#FF9500",
    marginLeft: 12,
  },
  coinsText: {
    color: "#1B1200",
    fontWeight: "700",
    fontSize: 12,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  earnButton: {
    flex: 1,
    backgroundColor: "#FF9500",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  redeemButton: {
    flex: 1,
    backgroundColor: "#2B2B35",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  buttonText: {
    color: "#1B1200",
    fontWeight: "700",
  },
  redeemButtonText: {
    color: "#000000",
    fontWeight: "600",
  },
  helperText: {
    color: "#666666",
    fontSize: 12,
    marginTop: 12,
  },
});