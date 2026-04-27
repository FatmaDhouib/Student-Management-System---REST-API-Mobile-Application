# Projet Étudiants Management

Une application full-stack moderne pour la gestion d'étudiants, combinant une **API REST Spring Boot** robuste et une **application mobile interactive** développée avec **Expo/React Native**.

---

## 🏗️ Architecture du Projet

Le projet est divisé en deux parties principales :

*   **`api-spring-boot`** : Le backend fournissant une interface RESTful sécurisée connectée à une base de données PostgreSQL.
*   **`mobile-app`** : L'interface utilisateur mobile permettant de visualiser et d'interagir avec les données des étudiants.

---

## 🛠️ Stack Technique

### Backend (API)
*   **Framework** : Spring Boot 4.0.5
*   **Langage** : Java 21
*   **Persistance** : Spring Data JPA / PostgreSQL 15-alpine
*   **Cache** : Redis (Data caching)
*   **Documentation** : OpenAPI 3.0 / Swagger UI
*   **Tests** : Cucumber (BDD) / JUnit 5
*   **Outils** : Lombok, Maven

### Mobile (Frontend)
*   **Framework** : Expo 54 / React Native 0.81.5
*   **Langage** : TypeScript
*   **Navigation** : Expo Router (Tabs Layout)
*   **Styling** : StyleSheet (Native)

### DevOps & Outils
*   **Containerisation** : Docker & Docker Compose
*   **Gestion de Versions** : Git

---

## 🚀 Installation et Démarrage

### 0. Prérequis
Assurez-vous d'avoir installé :
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/)
*   [Java 21 JDK](https://adoptium.net/temurin/releases/?version=21)
*   [Node.js](https://nodejs.org/) (v18+)

### 1. Base de Données & Infrastructure
La base de données PostgreSQL et Redis sont gérées via Docker Compose.
```bash
docker-compose up -d
```

### 2. Démarrage de l'API Backend
Naviguez dans le dossier de l'API et lancez le serveur :
```bash
cd api-spring-boot
./mvnw spring-boot:run
```
L'API sera accessible sur : `http://localhost:8080`
La documentation Swagger est disponible sur : `http://localhost:8080/swagger-ui.html`

### 3. Démarrage de l'Application Mobile
Naviguez dans le dossier mobile et lancez Expo :
```bash
cd mobile-app
npm install
npm start
```
Vous pouvez ensuite scanner le QR code avec l'application Expo Go sur votre téléphone ou lancer un émulateur iOS/Android.

---

## 📂 Structure des fichiers

```text
projet-etudiants/
├── api-spring-boot/             # Backend Java / Spring Boot
│   ├── src/main/java/com/.../    
│   │   ├── controller/          # Endpoints REST
│   │   ├── model/               # Entités JPA
│   │   ├── repository/          # Accès base de données (JPA)
│   │   ├── service/             # Logique métier
│   │   └── dto/                 # Objets de transfert de données
│   ├── src/test/java/.../       # Tests (JUnit, Cucumber)
│   ├── src/main/resources/      # application.properties
│   ├── Dockerfile               # Image Docker Backend
│   └── pom.xml                  # Dépendances Maven
├── mobile-app/                  # Frontend Mobile / Expo
│   ├── app/                     # Navigation (Expo Router)
│   │   ├── (tabs)/              # Écrans principaux (Tab Bar)
│   │   └── _layout.tsx          # Configuration du layout racine
│   ├── components/              # Composants UI réutilisables
│   ├── assets/                  # Images et Polices
│   ├── types/                   # Définitions TypeScript
│   ├── app.json                 # Configuration Expo
│   └── package.json             # Dépendances NPM
├── k8s/                         # Manifests Kubernetes (Deployments, Services)
├── docker-compose.yml           # Orchestration Docker (API, DB, Redis)
└── README.md                    # Documentation Générale
```

---

## 🔗 Endpoints API Principaux

### Étudiants (`/api/etudiants`)
| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/etudiants` | Liste des étudiants (filtre `?annee=` optionnel) |
| `GET` | `/api/etudiants/{id}` | Détails d'un étudiant |
| `POST` | `/api/etudiants` | Ajouter un étudiant |
| `PUT` | `/api/etudiants/{id}` | Modifier un étudiant |
| `DELETE` | `/api/etudiants/{id}` | Supprimer un étudiant |

### Départements (`/api/departements`)
| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/departements` | Liste de tous les départements |
| `POST` | `/api/departements` | Créer un nouveau département |

> [!TIP]
> Pour une documentation interactive complète, visitez l'interface **Swagger UI** une fois l'API démarrée.

---

## ✨ Fonctionnalités implémentées
- ✅ Liste des étudiants avec rendu optimisé (`FlatList`)
- ✅ Gestion d'état de chargement et d'erreur
- ✅ Containerisation de la base de données
- ✅ Communication Backend/Frontend temps réel
