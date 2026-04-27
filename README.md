# Projet Étudiants Management

Une application full-stack moderne pour la gestion d'étudiants, évoluant
vers une architecture microservices complète. Le projet combine une API
REST Spring Boot robuste, des microservices de découverte et de
notation, une API Gateway, une application mobile interactive
(Expo/React Native), et une interface d'administration Next.js.

## Architecture du Projet (Version 3 - Microservices)

L'architecture complète est orchestrée avec Docker Compose et se compose
des services suivants :

-   **Eureka Server** : Serveur de registre (Discovery Service) pour la
    communication inter-microservices.
-   **etudiant-service** : Microservice principal pour la gestion des
    étudiants (hérité de l'API Spring Boot).
-   **grading-service** : Microservice pour la gestion des notes des
    étudiants.
-   **api-gateway** : Point d'entrée unique (API Gateway) qui route les
    requêtes vers les microservices appropriés.
-   **frontend** : Application Next.js (App Router) pour
    l'administration complète (CRUD étudiants/départements).
-   **mobile-app** : Application mobile (Expo/React Native) pour la
    consultation filtrée par département.
-   **postgres** : Base de données relationnelle.
-   **redis** : Cache pour optimiser les performances des endpoints de
    lecture.

## Stack Technique

### Backend & Microservices

-   Framework : Spring Boot 4.0.5 / Spring Cloud
-   Langage : Java 21
-   Persistance : Spring Data JPA / PostgreSQL 15-alpine
-   Cache : Redis (@Cacheable, @CacheEvict)
-   Communication : OpenFeign, Eureka
-   Gateway : Spring Cloud Gateway
-   Documentation : OpenAPI 3.0 / Swagger UI
-   Tests : Cucumber / JUnit 5
-   Outils : Lombok, Maven

### Frontend Mobile

-   Framework : Expo / React Native
-   Langage : TypeScript
-   Navigation : Expo Router
-   API : Fetch / Axios via API Gateway

### Frontend Web Admin

-   Framework : Next.js 14
-   Langage : TypeScript
-   Styling : Tailwind CSS
-   Architecture : App Router

### DevOps & Outils

-   Docker & Docker Compose
-   Kubernetes (K3s)
-   GitHub Actions
-   Git (branches version-3, CI/CD)

## Installation et Démarrage

### Prérequis

-   Docker Desktop
-   Java 21
-   Node.js 18+
-   Git

### 1. Clonage du projet

``` bash
git clone <votre-depot-url>
cd projet-etudiants
git checkout version-3
```

### 2. Démarrage complet

``` bash
docker compose up --build
```

## Services accessibles

-   API Gateway : http://localhost:8080
-   Eureka Server : http://localhost:8761
-   Frontend : http://localhost:3000
-   Etudiant Service : http://localhost:8081
-   Grading Service : http://localhost:8082

## API Endpoints

### Etudiants

-   GET /api/etudiants
-   GET /api/etudiants/{id}
-   POST /api/etudiants
-   PUT /api/etudiants/{id}
-   DELETE /api/etudiants/{id}

### Départements

-   GET /api/departements
-   POST /api/departements
-   PUT /api/departements/{id}
-   DELETE /api/departements/{id}

### Notes

-   GET /api/notes
-   POST /api/notes
-   PUT /api/notes/{id}
-   DELETE /api/notes/{id}

## Fonctionnalités

-   CRUD étudiants et départements
-   Microservice notes (grading-service)
-   Communication inter-microservices via Feign
-   Service Discovery avec Eureka
-   API Gateway centralisée
-   Cache Redis
-   Application mobile filtrée par département
-   Dashboard admin Next.js

## Kubernetes

Déploiement via K3s :

``` bash
kubectl apply -f k8s/
```

## Tests

### Backend

``` bash
./mvnw test
```

## Contribution

1.  Branch from version-3
2.  Commit with Jira key
3.  Open Pull Request
4.  Review required
5.  Merge after CI checks

## Licence

Projet académique Spring Boot + Microservices + Docker + Mobile +
Next.js
