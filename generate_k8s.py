import os

files = {
    "k8s/secrets/postgres-secret.yaml": """apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
type: Opaque
data:
  POSTGRES_DB: ZXR1ZGlhbnRzX2Ri       # etudiants_db
  POSTGRES_USER: cG9zdGdyZXM=         # postgres
  POSTGRES_PASSWORD: cG9zdGdyZXM=     # postgres
""",
    "k8s/secrets/jwt-secret.yaml": """apiVersion: v1
kind: Secret
metadata:
  name: jwt-secret
type: Opaque
data:
  JWT_SECRET: dm90cmVfc2VjcmV0X2p3dF9pY2k=   # votre_secret_jwt_ici
""",
    "k8s/postgres/postgres-pvc.yaml": """apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
""",
    "k8s/postgres/postgres-deployment.yaml": """apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:15-alpine
          envFrom:
            - secretRef:
                name: postgres-secret
          volumeMounts:
            - name: postgres-storage
              mountPath: /var/lib/postgresql/data
      volumes:
        - name: postgres-storage
          persistentVolumeClaim:
            claimName: postgres-pvc
""",
    "k8s/postgres/postgres-service.yaml": """apiVersion: v1
kind: Service
metadata:
  name: db
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
  type: ClusterIP
""",
    "k8s/mongodb/mongodb-pvc.yaml": """apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mongodb-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
""",
    "k8s/mongodb/mongodb-deployment.yaml": """apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
        - name: mongodb
          image: mongo:7
          ports:
            - containerPort: 27017
          volumeMounts:
            - name: mongodb-storage
              mountPath: /data/db
      volumes:
        - name: mongodb-storage
          persistentVolumeClaim:
            claimName: mongodb-pvc
""",
    "k8s/mongodb/mongodb-service.yaml": """apiVersion: v1
kind: Service
metadata:
  name: mongodb
spec:
  selector:
    app: mongodb
  ports:
    - port: 27017
      targetPort: 27017
  type: ClusterIP
""",
    "k8s/redis/redis-deployment.yaml": """apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
        - name: redis
          image: redis:7-alpine
          ports:
            - containerPort: 6379
""",
    "k8s/redis/redis-service.yaml": """apiVersion: v1
kind: Service
metadata:
  name: redis
spec:
  selector:
    app: redis
  ports:
    - port: 6379
      targetPort: 6379
  type: ClusterIP
""",
    "k8s/zookeeper/zookeeper-deployment.yaml": """apiVersion: apps/v1
kind: Deployment
metadata:
  name: zookeeper
spec:
  replicas: 1
  selector:
    matchLabels:
      app: zookeeper
  template:
    metadata:
      labels:
        app: zookeeper
    spec:
      containers:
        - name: zookeeper
          image: confluentinc/cp-zookeeper:7.5.0
          env:
            - name: ZOOKEEPER_CLIENT_PORT
              value: "2181"
          ports:
            - containerPort: 2181
""",
    "k8s/zookeeper/zookeeper-service.yaml": """apiVersion: v1
kind: Service
metadata:
  name: zookeeper
spec:
  selector:
    app: zookeeper
  ports:
    - port: 2181
      targetPort: 2181
  type: ClusterIP
""",
    "k8s/kafka/kafka-deployment.yaml": """apiVersion: apps/v1
kind: Deployment
metadata:
  name: kafka
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kafka
  template:
    metadata:
      labels:
        app: kafka
    spec:
      containers:
        - name: kafka
          image: confluentinc/cp-kafka:7.5.0
          env:
            - name: KAFKA_BROKER_ID
              value: "1"
            - name: KAFKA_ZOOKEEPER_CONNECT
              value: "zookeeper:2181"
            - name: KAFKA_ADVERTISED_LISTENERS
              value: "PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:29092"
            - name: KAFKA_LISTENER_SECURITY_PROTOCOL_MAP
              value: "PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT"
            - name: KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR
              value: "1"
          ports:
            - containerPort: 9092
""",
    "k8s/kafka/kafka-service.yaml": """apiVersion: v1
kind: Service
metadata:
  name: kafka
spec:
  selector:
    app: kafka
  ports:
    - port: 9092
      targetPort: 9092
  type: ClusterIP
""",
    "k8s/etudiant-service/deployment.yaml": """apiVersion: apps/v1
kind: Deployment
metadata:
  name: etudiant-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: etudiant-service
  template:
    metadata:
      labels:
        app: etudiant-service
    spec:
      containers:
        - name: etudiant-service
          image: username/etudiant-service:2.0
          ports:
            - containerPort: 8081
          env:
            - name: SPRING_DATASOURCE_URL
              value: jdbc:postgresql://db:5432/etudiants_db
            - name: SPRING_DATASOURCE_USERNAME
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: POSTGRES_USER
            - name: SPRING_DATASOURCE_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: POSTGRES_PASSWORD
            - name: SPRING_DATA_REDIS_HOST
              value: redis
            - name: SPRING_KAFKA_BOOTSTRAP_SERVERS
              value: kafka:9092
          readinessProbe:
            httpGet:
              path: /actuator/health
              port: 8081
            initialDelaySeconds: 30
            periodSeconds: 10
""",
    "k8s/etudiant-service/service.yaml": """apiVersion: v1
kind: Service
metadata:
  name: etudiant-service
spec:
  selector:
    app: etudiant-service
  ports:
    - port: 8081
      targetPort: 8081
  type: ClusterIP
""",
    "k8s/grading-service/deployment.yaml": """apiVersion: apps/v1
kind: Deployment
metadata:
  name: grading-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: grading-service
  template:
    metadata:
      labels:
        app: grading-service
    spec:
      containers:
        - name: grading-service
          image: username/grading-service:2.0
          ports:
            - containerPort: 8082
          env:
            - name: SPRING_DATASOURCE_URL
              value: jdbc:postgresql://db:5432/etudiants_db
            - name: SPRING_DATASOURCE_USERNAME
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: POSTGRES_USER
            - name: SPRING_DATASOURCE_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secret
                  key: POSTGRES_PASSWORD
            - name: SPRING_KAFKA_BOOTSTRAP_SERVERS
              value: kafka:9092
          readinessProbe:
            httpGet:
              path: /actuator/health
              port: 8082
            initialDelaySeconds: 30
            periodSeconds: 10
""",
    "k8s/grading-service/service.yaml": """apiVersion: v1
kind: Service
metadata:
  name: grading-service
spec:
  selector:
    app: grading-service
  ports:
    - port: 8082
      targetPort: 8082
  type: ClusterIP
""",
    "k8s/notification-service/deployment.yaml": """apiVersion: apps/v1
kind: Deployment
metadata:
  name: notification-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: notification-service
  template:
    metadata:
      labels:
        app: notification-service
    spec:
      containers:
        - name: notification-service
          image: username/notification-service:2.0
          ports:
            - containerPort: 8083
          env:
            - name: SPRING_KAFKA_BOOTSTRAP_SERVERS
              value: kafka:9092
          readinessProbe:
            httpGet:
              path: /actuator/health
              port: 8083
            initialDelaySeconds: 30
            periodSeconds: 10
""",
    "k8s/notification-service/service.yaml": """apiVersion: v1
kind: Service
metadata:
  name: notification-service
spec:
  selector:
    app: notification-service
  ports:
    - port: 8083
      targetPort: 8083
  type: ClusterIP
""",
    "k8s/auth-service/deployment.yaml": """apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
        - name: auth-service
          image: username/auth-service:2.0
          ports:
            - containerPort: 3001
          env:
            - name: MONGO_URI
              value: mongodb://mongodb:27017/authdb
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: jwt-secret
                  key: JWT_SECRET
""",
    "k8s/auth-service/service.yaml": """apiVersion: v1
kind: Service
metadata:
  name: auth-service
spec:
  selector:
    app: auth-service
  ports:
    - port: 3001
      targetPort: 3001
  type: ClusterIP
""",
    "k8s/frontend/deployment.yaml": """apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: username/frontend:2.0
          ports:
            - containerPort: 3000
""",
    "k8s/frontend/service.yaml": """apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  selector:
    app: frontend
  ports:
    - port: 3000
      targetPort: 3000
  type: ClusterIP
""",
    "k8s/ingress.yaml": """apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: main-ingress
  annotations:
    traefik.ingress.kubernetes.io/router.middlewares: default-strip-prefix@kubernetescrd
spec:
  rules:
    - host: projet-etudiants.local
      http:
        paths:
          - path: /api/etudiants
            pathType: Prefix
            backend:
              service:
                name: etudiant-service
                port:
                  number: 8081
          - path: /api/notes
            pathType: Prefix
            backend:
              service:
                name: grading-service
                port:
                  number: 8082
          - path: /auth
            pathType: Prefix
            backend:
              service:
                name: auth-service
                port:
                  number: 3001
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend
                port:
                  number: 3000
"""
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("K8s manifests generated.")
