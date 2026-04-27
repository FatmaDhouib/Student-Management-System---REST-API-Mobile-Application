import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Etudiant } from '@/types/Etudiant';

type Props = {
  etudiant: Etudiant;
};

export default function EtudiantItem({ etudiant }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{etudiant.nom}</Text>
      <Text style={styles.text}>CIN: {etudiant.cin}</Text>
      <Text style={styles.text}>Date de naissance: {etudiant.dateNaissance}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 10,
    elevation: 3,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    marginBottom: 2,
  },
});