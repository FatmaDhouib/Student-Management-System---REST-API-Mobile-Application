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
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { etudiantService, departementService } from '@/services/api';
import { Etudiant } from '@/types/Etudiant';
import { Departement } from '@/types/Departement';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function StudentsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [departements, setDepartements] = useState<Departement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Filter states
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEtudiant, setEditingEtudiant] = useState<Etudiant | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    cin: '',
    dateNaissance: '',
    anneePremiereInscription: '',
    departementId: '',
  });

  const fetchData = useCallback(async (year?: number, deptId?: number) => {
    try {
      setLoading(true);
      const [etudiantsData, deptsData] = await Promise.all([
        etudiantService.getAll(year, deptId),
        departementService.getAll(),
      ]);
      setEtudiants(etudiantsData);
      setDepartements(deptsData);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData(
      selectedYear ? parseInt(selectedYear) : undefined,
      selectedDeptId ? parseInt(selectedDeptId) : undefined
    );
  }, [fetchData, selectedYear, selectedDeptId]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(
      selectedYear ? parseInt(selectedYear) : undefined,
      selectedDeptId ? parseInt(selectedDeptId) : undefined
    );
  };

  const handleYearFilter = (year: string) => {
    setSelectedYear(year);
  };

  const handleDeptFilter = (deptId: string) => {
    setSelectedDeptId(deptId);
  };

  const openModal = (etudiant?: Etudiant) => {
    if (etudiant) {
      setEditingEtudiant(etudiant);
      setFormData({
        nom: etudiant.nom,
        cin: etudiant.cin,
        dateNaissance: etudiant.dateNaissance,
        anneePremiereInscription: etudiant.anneePremiereInscription?.toString() || '',
        departementId: etudiant.departementId?.toString() || '',
      });
    } else {
      setEditingEtudiant(null);
      setFormData({
        nom: '',
        cin: '',
        dateNaissance: '',
        anneePremiereInscription: new Date().getFullYear().toString(),
        departementId: departements[0]?.id.toString() || '',
      });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.nom || !formData.cin || !formData.dateNaissance) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const payload = {
        ...formData,
        anneePremiereInscription: parseInt(formData.anneePremiereInscription),
        departementId: formData.departementId ? parseInt(formData.departementId) : null,
      };

      if (editingEtudiant) {
        await etudiantService.update(editingEtudiant.id, payload);
      } else {
        await etudiantService.create(payload);
      }
      setModalVisible(false);
      fetchData(selectedYear ? parseInt(selectedYear) : undefined);
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Confirmer la suppression',
      'Voulez-vous vraiment supprimer cet étudiant ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              await etudiantService.delete(id);
              fetchData(selectedYear ? parseInt(selectedYear) : undefined);
            } catch (err: any) {
              Alert.alert('Erreur', err.message);
            }
          }
        },
      ]
    );
  };

  const renderEtudiant = ({ item }: { item: Etudiant }) => (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={[styles.studentName, { color: theme.text }]}>{item.nom}</Text>
          <Text style={[styles.studentDetails, { color: theme.icon }]}>CIN: {item.cin}</Text>
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
      <View style={styles.cardFooter}>
        <View style={[styles.tag, { backgroundColor: colorScheme === 'light' ? '#E5E7EB' : '#374151' }]}>
          <IconSymbol name="calendar" size={12} color={theme.icon} />
          <Text style={[styles.tagText, { color: theme.text }]}>{item.anneePremiereInscription || 'N/A'}</Text>
        </View>
        {item.departementNom && (
          <View style={[styles.tag, { backgroundColor: theme.tint + '20' }]}>
            <IconSymbol name="building" size={12} color={theme.tint} />
            <Text style={[styles.tagText, { color: theme.tint }]}>{item.departementNom}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Étudiants</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.tint }]} onPress={() => openModal()}>
          <IconSymbol name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <Text style={[styles.filterLabel, { color: theme.text }]}>Département :</Text>
        <View style={[styles.pickerWrapper, { borderColor: theme.border, backgroundColor: theme.card }]}>
          <Picker
            selectedValue={selectedDeptId}
            onValueChange={handleDeptFilter}
            style={[styles.picker, { color: theme.text, backgroundColor: theme.card, borderWidth: 0 }]}
            dropdownIconColor={theme.text}
          >
            <Picker.Item 
              label="Tous les départements" 
              value="" 
              color={Platform.OS === 'web' ? (colorScheme === 'dark' ? '#fff' : '#000') : theme.text}
              style={{ backgroundColor: theme.card, color: theme.text }} /* CSS for web options */
            />
            {departements.map((dept) => (
              <Picker.Item 
                key={dept.id} 
                label={dept.nom} 
                value={dept.id.toString()} 
                color={Platform.OS === 'web' ? (colorScheme === 'dark' ? '#fff' : '#000') : theme.text}
                style={{ backgroundColor: theme.card, color: theme.text }}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <Text style={[styles.filterLabel, { color: theme.text }]}>Année :</Text>
        <TextInput
          style={[styles.yearInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
          placeholder="Ex: 2023"
          placeholderTextColor={theme.icon}
          keyboardType="numeric"
          value={selectedYear}
          onChangeText={handleYearFilter}
        />
        {selectedYear !== '' && (
          <TouchableOpacity onPress={() => setSelectedYear('')} style={styles.clearButton}>
            <IconSymbol name="xmark.circle.fill" size={20} color={theme.icon} />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.card }]} onPress={() => fetchData()}>
            <Text style={[styles.retryText, { color: theme.tint }]}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={etudiants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEtudiant}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="person.3.fill" size={60} color="#ccc" />
              <Text style={styles.emptyText}>Aucun étudiant trouvé</Text>
            </View>
          }
        />
      )}

      <Modal
        animationType="slide"
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
                {editingEtudiant ? 'Modifier Étudiant' : 'Nouvel Étudiant'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <IconSymbol name="xmark" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Nom complet</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
                  value={formData.nom}
                  onChangeText={(text) => setFormData({ ...formData, nom: text })}
                  placeholder="Jean Dupont"
                  placeholderTextColor={theme.icon}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>CIN</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
                  value={formData.cin}
                  onChangeText={(text) => setFormData({ ...formData, cin: text })}
                  placeholder="AB123456"
                  placeholderTextColor={theme.icon}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Date de Naissance (YYYY-MM-DD)</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
                  value={formData.dateNaissance}
                  onChangeText={(text) => setFormData({ ...formData, dateNaissance: text })}
                  placeholder="2000-01-01"
                  placeholderTextColor={theme.icon}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Année d'inscription</Text>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
                  value={formData.anneePremiereInscription}
                  onChangeText={(text) => setFormData({ ...formData, anneePremiereInscription: text })}
                  keyboardType="numeric"
                  placeholder="2023"
                  placeholderTextColor={theme.icon}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Département</Text>
                <View style={styles.pickerContainer}>
                   {departements.map((dept) => (
                     <TouchableOpacity 
                       key={dept.id} 
                       style={[
                         styles.pickerItem, 
                         { borderColor: theme.border, backgroundColor: theme.card },
                         formData.departementId === dept.id.toString() && { backgroundColor: theme.tint, borderColor: theme.tint }
                       ]}
                       onPress={() => setFormData({ ...formData, departementId: dept.id.toString() })}
                     >
                       <Text style={[
                         styles.pickerItemText, 
                         { color: theme.text },
                         formData.departementId === dept.id.toString() && { color: '#fff' }
                       ]}>
                         {dept.nom}
                       </Text>
                     </TouchableOpacity>
                   ))}
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: theme.tint }]} 
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </ScrollView>
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 100,
  },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 44,
  },
  yearInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  clearButton: {
    marginLeft: -30,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  studentDetails: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 5,
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
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
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
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
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 5,
  },
  pickerItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerItemText: {
    fontSize: 14,
  },
  saveButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
