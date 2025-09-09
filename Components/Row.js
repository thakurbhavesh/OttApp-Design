import React from "react";
import { View, Text, Pressable, Switch, StyleSheet } from "react-native";

export function Row({
  title,
  subtitle,
  rightType = "chevron",
  valueText,
  switchValue,
  onToggle,
  onPress,
  destructive,
  testID,
}) {
  const content = (
    <View style={styles.container}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        <Text
          style={[styles.title, destructive ? styles.textDanger : styles.textNormal]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle}>{subtitle}</Text>
        ) : null}
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        {rightType === "value" && valueText ? (
          <Text style={styles.valueText}>{valueText}</Text>
        ) : null}

        {rightType === "switch" ? (
          <Switch
            trackColor={{ false: "#3C3C46", true: "#FF6F00" }}
            thumbColor="#FFFFFF"
            value={!!switchValue}
            onValueChange={onToggle}
          />
        ) : null}

        {rightType === "chevron" ? (
          <Text style={styles.chevron}>›</Text>
        ) : null}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.pressable, pressed ? styles.pressableActive : null]}
        testID={testID}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.card}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  leftSection: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  textNormal: {
    color: "#000000",
  },
  textDanger: {
    color: "#FF3B30",
  },
  subtitle: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  valueText: {
    fontSize: 14,
    color: "#666666",
  },
  chevron: {
    fontSize: 24,
    color: "#666666",
    marginLeft: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
  },
  pressable: {
    backgroundColor: "#FFFFFF",
  },
  pressableActive: {
    backgroundColor: "#121219",
  },
});