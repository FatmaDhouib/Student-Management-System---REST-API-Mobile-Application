import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { departementService } from '@/services/api';
import { Departement } from '@/types/Departement';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function DepartementsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [departements, setDepartements] = useState<Departement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDept, setEditingDept] = useState<Departement | null>(null);
  const [deptNom, setDeptNom] = useState('');

  const fetchDepartements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await departementService.getAll();
      setDepartements(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Error fetching departments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartements();
  }, [fetchDepartements]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDepartements();
  };

  const openModal = (dept?: Departement) => {
    if (dept) {
      setEditingDept(dept);
      setDeptNom(dept.nom);
    } else {
      setEditingDept(null);
      setDeptNom('');
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!deptNom.trim()) {
      Alert.alert('Erreur', 'Le nom du département est requis');
      return;
    }

    try {
      if (editingDept) {
        await departementService.update(editingDept.id, { nom: deptNom });
      } else {
        await departementService.create({ nom: deptNom });
      }
      setModalVisible(false);
      fetchDepartements();
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Confirmer la suppression',
      'Voulez-vous vraiment supprimer ce département ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              await departementService.delete(id);
              fetchDepartements();
            } catch (err: any) {
              Alert.alert('Erreur', err.message);
            }
          }
        },
      ]
    );
  };

  const renderDepartement = ({ item }: { item: Departement }) => (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.cardContent}>
        <View style={[styles.iconWrapper, { backgroundColor: theme.tint + '15' }]}>
          <IconSymbol name="building" size={24} color={theme.tint} />
        </View>
        <View style={styles.infoWrapper}>
          <Text style={[styles.deptName, { color: theme.text }]}>{item.nom}</Text>
          <Text style={[styles.deptSub, { color: theme.icon }]}>ID: {item.id}</Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => openModal(item)} style={styles.iconButton}>
          <IconSymbol name="pencil" size={20} color={theme.tint} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconButton}>
          <IconSymbol name="trash" size={20} color={theme.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Départements</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.tint }]} onPress={() => openModal()}>
          <IconSymbol name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.card }]} onPress={fetchDepartements}>
            <Text style={[styles.retryText, { color: theme.tint }]}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={departements}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDepartement}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="building.2.fill" size={60} color="#ccc" />
              <Text style={styles.emptyText}>Aucun département trouvé</Text>
            </View>
          }
        />
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {editingDept ? 'Modifier Département' : 'Nouveau Département'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <IconSymbol name="xmark" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Nom du département</Text>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
                value={deptNom}
                onChangeText={setDeptNom}
                placeholder="Ex: Informatique"
                placeholderTextColor={theme.icon}
                autoFocus
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: theme.tint }]} 
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: Fonts.rounded,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoWrapper: {
    flex: 1,
  },
  deptName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  deptSub: {
    fontSize: 12,
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  retryText: {
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 24,
    padding: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  saveButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
