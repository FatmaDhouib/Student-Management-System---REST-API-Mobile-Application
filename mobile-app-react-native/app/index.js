import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, SafeAreaView, Platform, TouchableOpacity } from 'react-native';

export default function App() {
  const [departements, setDepartements] = useState([]);
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = Platform.OS === 'web' 
    ? 'http://localhost:8888' 
    : 'http://10.0.2.2:8888';

  useEffect(() => {
    fetchDepartements();
  }, []);

  const fetchDepartements = () => {
    fetch(`${baseUrl}/api/departements`)
      .then(response => response.json())
      .then(data => {
        setDepartements(data);
        if (data.length > 0) {
          handleSelectDepartement(data[0]);
        } else {
          setLoading(false);
        }
      })
      .catch(error => {
        console.error("Erreur départements:", error);
        setLoading(false);
      });
  };

  const handleSelectDepartement = (dept) => {
    setSelectedDepartement(dept);
    setLoading(true);
    fetch(`${baseUrl}/api/etudiants`)
      .then(response => response.json())
      .then(data => {
        // Ideally the API filters by dept, here we filter client-side assuming no backend filter exists
        // If the API supported it: /api/etudiants?departementId=${dept.id}
        setEtudiants(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur étudiants:", error);
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Étudiants par Département</Text>
      
      {departements.length > 0 && (
        <View style={styles.deptContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={departements}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.deptTab, selectedDepartement?.id === item.id && styles.activeDeptTab]}
                onPress={() => handleSelectDepartement(item)}
              >
                <Text style={[styles.deptText, selectedDepartement?.id === item.id && styles.activeDeptText]}>
                  {item.nom}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : etudiants.length === 0 ? (
        <Text style={styles.empty}>Aucun étudiant trouvé.</Text>
      ) : (
        <FlatList
          data={etudiants}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.nom ? item.nom.charAt(0).toUpperCase() : '?'}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.nom}</Text>
                <Text style={styles.detail}>CIN: {item.cin}</Text>
                {item.age && <Text style={styles.detail}>Age: {item.age} ans</Text>}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    paddingTop: 50,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  deptContainer: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    backgroundColor: 'white',
  },
  deptTab: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeDeptTab: {
    borderBottomColor: '#6200ee',
  },
  deptText: {
    fontSize: 16,
    color: '#666',
  },
  activeDeptText: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: '#666',
  },
});
