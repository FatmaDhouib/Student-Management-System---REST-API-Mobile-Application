import os

files = {
    "helm/projet-etudiants/Chart.yaml": """apiVersion: v2
name: projet-etudiants
description: Plateforme micro services de gestion des étudiants
type: application
version: 1.0.0
appVersion: "2.0.0"
""",
    "helm/projet-etudiants/values.yaml": """replicaCount:
  etudiantService: 2
  gradingService: 1
  frontend: 1

images:
  etudiantService:
    repository: username/etudiant-service
    tag: "2.0"
    pullPolicy: IfNotPresent
  gradingService:
    repository: username/grading-service
    tag: "2.0"
    pullPolicy: IfNotPresent
  frontend:
    repository: username/frontend
    tag: "2.0"
    pullPolicy: IfNotPresent
  authService:
    repository: username/auth-service
    tag: "2.0"
    pullPolicy: IfNotPresent

postgres:
  storage: 1Gi
  database: etudiantsdb

ingress:
  host: projet-etudiants.local
""",
    "helm/projet-etudiants/values-prod.yaml": """replicaCount:
  etudiantService: 3
  gradingService: 2
  frontend: 2
""",
    "helm/projet-etudiants/templates/_helpers.tpl": """{{- define "projet-etudiants.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "projet-etudiants.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "projet-etudiants.labels" -}}
helm.sh/chart: {{ include "projet-etudiants.chart" . }}
{{ include "projet-etudiants.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "projet-etudiants.selectorLabels" -}}
app.kubernetes.io/name: {{ include "projet-etudiants.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "projet-etudiants.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}
""",
    "helm/projet-etudiants/templates/etudiant-service/deployment.yaml": """apiVersion: apps/v1
kind: Deployment
metadata:
  name: etudiant-service
  labels:
    {{- include "projet-etudiants.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount.etudiantService }}
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
          image: "{{ .Values.images.etudiantService.repository }}:{{ .Values.images.etudiantService.tag }}"
          imagePullPolicy: {{ .Values.images.etudiantService.pullPolicy }}
          ports:
            - containerPort: 8081
""",
    "helm/projet-etudiants/templates/etudiant-service/service.yaml": """apiVersion: v1
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
    "helm/projet-etudiants/templates/grading-service/deployment.yaml": """apiVersion: apps/v1
kind: Deployment
metadata:
  name: grading-service
  labels:
    {{- include "projet-etudiants.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount.gradingService }}
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
          image: "{{ .Values.images.gradingService.repository }}:{{ .Values.images.gradingService.tag }}"
          imagePullPolicy: {{ .Values.images.gradingService.pullPolicy }}
          ports:
            - containerPort: 8082
""",
    "helm/projet-etudiants/templates/grading-service/service.yaml": """apiVersion: v1
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
    "helm/projet-etudiants/templates/frontend/deployment.yaml": """apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  labels:
    {{- include "projet-etudiants.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount.frontend }}
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
          image: "{{ .Values.images.frontend.repository }}:{{ .Values.images.frontend.tag }}"
          imagePullPolicy: {{ .Values.images.frontend.pullPolicy }}
          ports:
            - containerPort: 3000
""",
    "helm/projet-etudiants/templates/frontend/service.yaml": """apiVersion: v1
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
    "helm/projet-etudiants/templates/ingress.yaml": """apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: main-ingress
  annotations:
    traefik.ingress.kubernetes.io/router.middlewares: default-strip-prefix@kubernetescrd
spec:
  rules:
    - host: {{ .Values.ingress.host }}
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

print("Helm chart generated.")
