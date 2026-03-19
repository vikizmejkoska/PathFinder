import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function StatCard({ label, value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 86,
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
});