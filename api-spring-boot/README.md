# Étudiants Management API 🚀

Ce répertoire contient le backend du projet de gestion d'étudiants. Il s'agit d'une API RESTful construite avec **Spring Boot**, conçue pour être performante, scalable et facile à maintenir.

---

## 🛠️ Stack Technique

- **Framework Core** : Spring Boot 4.0.5
- **Langage** : Java 21 (Temurin)
- **Base de Données** : PostgreSQL 15
- **Cache & Performance** : Redis
- **Documentation** : Springdoc OpenAPI 3.0 (Swagger UI)
- **Validation & Mapping** : Java Bean Validation & DTO Pattern
- **Tests** : 
  - **Unitaires/Intégration** : JUnit 5 & Mockito
  - **Fonctionnels (BDD)** : Cucumber (Gherkin)
- **Productivité** : Lombok

---

## 🎯 Objectifs du Projet (Activité d'Intégration)

Conformément aux exigences de l'activité **"Intégration des Compétences - Partie 2"**, ce backend démontre la maîtrise des concepts suivants :
- **Développement Agile & BDD** : Utilisation de Gherkin pour définir les comportements métier.
- **Architecture Propre** : Séparation stricte entre entités persistantes et DTOs via des mappers.
- **Haute Disponibilité** : Mise en cache avec Redis pour optimiser les performances de lecture.
- **Robustesse** : Gestion globale des exceptions pour des réponses API normalisées.
- **DevOps Ready** : Containerisation optimisée et orchestration via Docker/Kubernetes.

---

## 🏗️ Architecture Technique Détailée

### 1. Gestion des Données
- **Entités JPA** : Modélisation des relations (ex: `Etudiant` ↔ `Departement` via `@ManyToOne`).
- **Mappers** : Utilisation de classes de mapping dédiées pour transformer les Entités en DTOs, assurant qu'aucun détail interne de la DB ne fuite vers l'extérieur.

### 2. Gestion des Erreurs
L'API intègre un `GlobalExceptionHandler` qui intercepte les exceptions (ex: `ResourceNotFoundException`) et retourne un objet `ErrorResponse` structuré :
```json
{
  "status": 404,
  "message": "Étudiant introuvable avec id 123",
  "timestamp": "2026-04-07T..."
}
```

### 3. Tests & BDD (Behavior Driven Development)
Le projet utilise **Cucumber** pour valider les règles métier complexes, comme le calcul automatique de l'âge à partir de la date de naissance.
### 4. Modèle de Données (Étudiant)
Chaque étudiant est caractérisé par les informations suivantes, validées lors de la création :
- **CIN** : Identifiant national unique.
- **Nom Complet** : Nom et prénom de l'étudiant.
- **Date de Naissance** : Utilisée pour le calcul dynamique de l'âge (via tests BDD).
- **Email** : Adresse de contact.
- **Année d'Inscription** : Année de première inscription à l'université.
- **Département** : Association vers un département académique existant.

---

---

## ⚙️ Configuration Exhaustive

L'application est hautement configurable via des variables d'environnement. Voici la liste complète des paramètres supportés :

| Variable | Description | Valeur par défaut |
| :--- | :--- | :--- |
| `SERVER_PORT` | Port d'écoute du serveur web Tomcat. | `8080` |
| `SPRING_DATASOURCE_URL` | URL JDBC pour la connexion à PostgreSQL. | `jdbc:postgresql://localhost:5432/etudiants_db` |
| `SPRING_DATASOURCE_USERNAME` | Nom d'utilisateur de la base de données. | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Mot de passe de la base de données. | `postgres` (Docker) / `root` (Local) |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Stratégie de génération de schéma (update, create, none). | `update` |
| `SPRING_DATA_REDIS_HOST` | Adresse TCP du serveur Redis pour le cache. | `localhost` |
| `SPRING_DATA_REDIS_PORT` | Port du serveur Redis. | `6379` |

---

## 🔗 Catalogue des Endpoints API

### 👨‍🎓 Gestion des Étudiants (`/api/etudiants`)

| Méthode | Route | Request Body / Params | Description | Codes HTTP |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/etudiants` | Query: `annee` (int, optional) | Liste filtrable des étudiants. Utilise le cache Redis. | 200 (OK) |
| **GET** | `/api/etudiants/{id}` | Path: `id` (long) | Détails complets d'un étudiant par son ID. | 200, 404 |
| **POST** | `/api/etudiants` | `EtudiantDTO` (JSON) | Ajoute un nouvel étudiant. Invalide le cache Redis. | 201, 400, 404 |
| **PUT** | `/api/etudiants/{id}` | Path: `id`, Body: `EtudiantDTO` | Met à jour les informations d'un étudiant existant. | 200, 404 |
| **DELETE** | `/api/etudiants/{id}` | Path: `id` (long) | Supprime définitivement un étudiant. | 204, 404 |

#### Structure `EtudiantDTO`
```json
{
  "cin": "string (ex: 12345678)",
  "nom": "string",
  "dateNaissance": "YYYY-MM-DD",
  "email": "string",
  "anneePremiereInscription": 2024,
  "departementId": 1 (optionnel)
}
```

### 🏢 Gestion des Départements (`/api/departements`)

| Méthode | Route | Request Body / Params | Description | Codes HTTP |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/departements` | Aucun | Liste tous les départements académiques. | 200 (OK) |
| **GET** | `/api/departements/{id}` | Path: `id` (long) | Récupère un département par son identifiant unique. | 200, 404 |
| **POST** | `/api/departements` | `DepartementDTO` (JSON) | Crée un nouveau département pour l'organisation. | 201, 400 |
| **PUT** | `/api/departements/{id}` | Path: `id`, Body: `DepartementDTO` | Modifie les propriétés d'un département. | 200, 404 |
| **DELETE** | `/api/departements/{id}` | Path: `id` (long) | Supprime un département (attention aux dépendances). | 204, 404 |

#### Structure `DepartementDTO`
```json
{
  "nom": "Génie Informatique",
  "code": "GINF"
}
```

---

## 🚀 Démarrage et Déploiement

### Développement Local
1. Lancez l'infrastructure : `docker-compose up -d db redis`
2. Exécutez l'API : `./mvnw spring-boot:run`

### Dockerisation Complète
Le build multi-stage est supporté via le `Dockerfile` pour produire une image légère prête pour la production.
---

## 🧪 Tests et Qualité

Le projet utilise **Cucumber** pour les tests de comportement (BDD). Les fichiers `.feature` décrivent les scénarios attendus en langage naturel.

Pour exécuter tous les tests (JUnit + Cucumber) :
```bash
./mvnw test
```

---

## 📖 Documentation API interactive (Swagger)

Une fois l'application démarrée, accédez à l'interface **Swagger UI** pour tester les différents endpoints en temps réel :
👉 [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## ☸️ Déploiement Kubernetes

Des manifests prédéfinis sont disponibles dans le dossier `/k8s` à la racine pour déployer l'intégralité de l'architecture sur un cluster (Type Minikube ou Cloud) :
- `postgres-deployment.yaml`
- `redis-deployment.yaml`
- `etudiant-deployment.yaml`

---

## 📝 Notes de Développement
- Le projet utilise **CORS** ouvert (`*`) pour permettre la communication fluide avec l'application mobile en environnement de développement.
- Le cycle de vie des données est géré via Hibernate (`ddl-auto: update`).
