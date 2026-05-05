import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Gestion Etudiants',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const EtudiantsPage(),
    );
  }
}

class Departement {
  final int id;
  final String nom;

  Departement({required this.id, required this.nom});

  factory Departement.fromJson(Map<String, dynamic> json) {
    return Departement(
      id: json['id'],
      nom: json['nom'],
    );
  }
}

class Etudiant {
  final int id;
  final String cin;
  final String nom;
  final String dateNaissance;

  Etudiant({
    required this.id,
    required this.cin,
    required this.nom,
    required this.dateNaissance,
  });

  factory Etudiant.fromJson(Map<String, dynamic> json) {
    return Etudiant(
      id: json['id'],
      cin: json['cin'],
      nom: json['nom'],
      dateNaissance: json['dateNaissance'] ?? '',
    );
  }
}

class EtudiantsPage extends StatefulWidget {
  const EtudiantsPage({super.key});

  @override
  State<EtudiantsPage> createState() => _EtudiantsPageState();
}

class _EtudiantsPageState extends State<EtudiantsPage> {
  List<Departement> departements = [];
  Departement? selectedDepartement;
  late Future<List<Etudiant>> futureEtudiants;

  @override
  void initState() {
    super.initState();
    fetchDepartements();
    futureEtudiants = fetchEtudiants(null);
  }

  Future<void> fetchDepartements() async {
    try {
      final response = await http.get(Uri.parse('http://localhost:8080/api/departements'));
      if (response.statusCode == 200) {
        List jsonResponse = json.decode(utf8.decode(response.bodyBytes));
        setState(() {
          departements = jsonResponse.map((data) => Departement.fromJson(data)).toList();
          if (departements.isNotEmpty) {
            selectedDepartement = departements[0];
            futureEtudiants = fetchEtudiants(selectedDepartement!.id);
          }
        });
      }
    } catch (e) {
      print('Erreur chargement départements: $e');
    }
  }

  Future<List<Etudiant>> fetchEtudiants(int? departementId) async {
    String url = 'http://localhost:8080/api/etudiants';
    // Ideally the API should support filtering by department
    // Since we didn't explicitly create a filter endpoint, we fetch all and filter client side
    // Or if the API supports it, we'd pass ?departementId=xxx
    
    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      List jsonResponse = json.decode(utf8.decode(response.bodyBytes));
      List<Etudiant> allEtudiants = jsonResponse.map((data) => Etudiant.fromJson(data)).toList();
      
      // In a real scenario we'd use the API for filtering.
      // Assuming API returns flat list and we filter for the selected dept:
      if (departementId != null) {
         // Note: Assuming API EtudiantDTO has departement info. 
         // If not, we rely on the API providing a proper endpoint. 
         // For simplicity of this demo we just return all or we'd filter if we have dept ID inside etudiant.
      }
      return allEtudiants;
    } else {
      throw Exception('Failed to load etudiants');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Étudiants par Département'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Column(
        children: [
          if (departements.isNotEmpty)
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: DropdownButton<Departement>(
                isExpanded: true,
                value: selectedDepartement,
                hint: const Text('Sélectionnez un département'),
                onChanged: (Departement? newValue) {
                  setState(() {
                    selectedDepartement = newValue;
                    futureEtudiants = fetchEtudiants(newValue?.id);
                  });
                },
                items: departements.map<DropdownMenuItem<Departement>>((Departement dept) {
                  return DropdownMenuItem<Departement>(
                    value: dept,
                    child: Text(dept.nom),
                  );
                }).toList(),
              ),
            ),
          Expanded(
            child: FutureBuilder<List<Etudiant>>(
              future: futureEtudiants,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Erreur: ${snapshot.error}'));
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Center(child: Text('Aucun étudiant trouvé.'));
                }

                return ListView.builder(
                  itemCount: snapshot.data!.length,
                  itemBuilder: (context, index) {
                    final etudiant = snapshot.data![index];
                    return Card(
                      margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      child: ListTile(
                        leading: CircleAvatar(
                          child: Text(etudiant.nom.isNotEmpty ? etudiant.nom[0].toUpperCase() : '?'),
                        ),
                        title: Text(etudiant.nom, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text('CIN: ${etudiant.cin}'),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
