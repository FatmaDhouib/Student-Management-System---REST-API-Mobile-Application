# Spring Boot 4 + Mobile App (Flutter & React Native) - Partie 2

Ce projet complet démontre la création d'une API REST avec Spring Boot (Java 21) et son intégration avec deux applications mobiles. La **Partie 2** enrichit le projet avec une architecture en couches, du cache Redis, des tests BDD, et un déploiement Kubernetes.

## 🚀 Nouvelles Fonctionnalités (Partie 2)

- **Architecture en Couches** : Séparation nette entre Controller, Service, Repository, DTO et Mapper.
- **BDD Testing** : Tests de comportement avec **Cucumber** et Gherkin pour la logique métier (`age()`).
- **Cache Redis** : Optimisation des performances avec `@Cacheable` on the endpoints de lecture.
- **Documentation Swagger** : OpenAPI 3 auto-générée et annotée.
- **Interface Web Légère** : Page `index.html` simple pour lister les étudiants via Fetch API.
- **Orchestration K8s** : Manifestes pour déploiement sur Kubernetes (K3S).

## 📂 Structure du Projet

- `api-spring-boot/` : API REST Spring Boot (Java 21).
  - `src/main/resources/static/index.html` : Interface web.
  - `src/test/resources/features/` : Tests BDD Cucumber.
- `k8s/` : Manifestes Kubernetes (Deployment, Service).
- `docker-compose.yml` : Orchestration Docker (API + Postgres + Redis).

## 🛠️ Exécution et Test

### 1. Backend avec Docker Compose
```bash
docker compose up --build
```
- **API** : `http://localhost:8080/api/etudiants`
- **Swagger UI** : `http://localhost:8080/swagger-ui.html`
- **Web Interface** : `http://localhost:8080/index.html`

### 2. Tests BDD (Cucumber)
Exécutez les tests via Maven :
```bash
cd api-spring-boot
./mvnw test
```

### 3. Publication Docker Hub
```bash
docker build -t <votre-username>/etudiant-service:1.0 ./api-spring-boot
docker push <votre-username>/etudiant-service:1.0
```

### 4. Déploiement Kubernetes (K3S)
```bash
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/etudiant-deployment.yaml
```
Accès via NodePort : `http://<node-ip>:30080/api/etudiants`

## 📱 Applications Mobiles
Les instructions pour **Flutter** et **React Native** restent valables (voir dossiers respectifs). L'API est désormais compatible avec les deux grâce aux DTOs.

---
*Note : Pour la traçabilité Jira, chaque commit sur la branche `version-2` suit le format `PROJ-XX : description`.*
