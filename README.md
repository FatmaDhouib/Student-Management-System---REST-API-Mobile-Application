# Projet Étudiants — Plateforme Micro Services

## Description
Ce projet est une plateforme de gestion des étudiants basée sur une architecture micro-services.
Il a été développé dans un but pédagogique pour illustrer l'évolution d'une architecture monolithique
vers une architecture Kubernetes-native. Les technologies clés incluent Spring Boot 4, Node.js, Next.js,
Kubernetes, Helm, et une stack complète d'observabilité.

## Architecture

![Architecture AWS Cloud](https://via.placeholder.com/800x400.png?text=Architecture+AWS+Cloud)

Cette architecture est Kubernetes-native. Les mécanismes historiques de Spring Cloud (Eureka, API Gateway, Feign)
ont été remplacés par les primitives Kubernetes :
- **Découverte de services** : DNS interne Kubernetes
- **Load Balancing** : Kube-Proxy et Service Kubernetes (ClusterIP)
- **Routage externe** : Ingress Controller (Traefik / ALB)
- **Communication inter-services** : RestClient standard

L'architecture AWS proposée s'appuie sur Amazon EKS pour l'orchestration, RDS pour PostgreSQL,
ElastiCache pour Redis, DocumentDB pour MongoDB, MSK pour Kafka, et ALB pour l'Ingress.

## Stack technique

| Composant | Technologie |
|---|---|
| Micro service étudiant | Spring Boot 4, JDK 17, PostgreSQL, Redis |
| Micro service notes | Spring Boot 4, PostgreSQL |
| Micro service notifications | Spring Boot 4, Apache Kafka |
| Micro service auth | Node.js, Express, MongoDB, JWT |
| Frontend | Next.js, Tailwind CSS |
| Application mobile | Flutter / React Native |
| Orchestration | Kubernetes (K3S / EKS), Helm |
| Observabilité | ELK Stack, Prometheus, Grafana |
| CI/CD | GitHub Actions, Xray, Jira |

## Lancement rapide

### Prérequis
- Docker Desktop >= 24.0
- Java 17, Maven 3.9+
- Node.js 20+
- kubectl, Helm 3

### Avec Docker Compose (développement local)
```bash
git clone https://github.com/votre_username/projet-etudiants.git
cd projet-etudiants
docker compose up --build
```
Accès aux services :
- API principale : http://localhost:8080
- Frontend : http://localhost:3000
- Kibana (logs) : http://localhost:5601
- Grafana (métriques) : http://localhost:3001
- Eureka Dashboard : retiré (architecture K8s-native)

### Avec Helm sur K3S
```bash
helm install projet-etudiants ./helm/projet-etudiants/
kubectl get pods --watch
```

## Captures d'écran

*(Insérez ici les captures d'écran de l'application)*

## Tests

```bash
# Tests unitaires + intégration + couverture JaCoCo
cd api-spring-boot && mvn verify

# Tests E2E Cypress (stack Docker démarrée au préalable)
cd frontend && npx cypress run

# Tests de stress Gatling
mvn gatling:test
```

## Structure du dépôt

```text
/projet-etudiants/
├── api-spring-boot/             # Micro service étudiant (Spring Boot)
├── grading-service/             # Micro service notes (Spring Boot)
├── notification-service/        # Micro service notifications + Kafka consumer
├── auth-service/                # Micro service auth (Node.js + Express + MongoDB)
├── frontend/                    # Application Next.js
│   └── cypress/e2e/             # Tests E2E Cypress
├── mobile-app/                  # Application Flutter ou React Native
├── helm/
│   └── projet-etudiants/        # Chart Helm packagisant toute la plateforme
│       ├── Chart.yaml
│       ├── values.yaml
│       ├── values-prod.yaml
│       └── templates/
├── k8s/                         # Manifests Kubernetes bruts (avant Helm)
├── observability/
│   ├── logstash/pipeline/
│   └── prometheus/
├── .github/
│   ├── workflows/
│   │   └── test-and-report.yml
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── docker-compose.yml
└── README.md                    # README professionnel avec captures d'écran
```

## Auteur
Fatma Dhouib, 2026
