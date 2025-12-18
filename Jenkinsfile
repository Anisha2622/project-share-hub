pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command:
    - cat
    tty: true
  - name: kubectl
    image: bitnami/kubectl:latest
    command:
    - cat
    tty: true
    securityContext:
      runAsUser: 0
      readOnlyRootFilesystem: false
    env:
    - name: KUBECONFIG
      value: /kube/config        
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig
  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json
  volumes:
  - name: docker-config
    configMap:
      name: docker-daemon-config
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
        }
    }
    
    environment {
        // REPLACE THESE WITH YOUR ACTUAL PROJECT SHARE HUB KEYS
        VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1YW16ZXNlcHRic2xrdXJnc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODI0MjEsImV4cCI6MjA4MDE1ODQyMX0.BfGNcplht5XdBcp8X0H2dYMj6DUvp1bxR9KAHnbU1gc"
        VITE_SUPABASE_URL="https://vwthzuvpusfawmhhlzww.supabase.co"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                        sleep 15
                        docker build \
                          --build-arg VITE_SUPABASE_URL="${VITE_SUPABASE_URL}" \
                          --build-arg VITE_SUPABASE_ANON_KEY="${VITE_SUPABASE_ANON_KEY}" \
                          -t project-share-hub:latest .
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    // Make sure 'sonar-token-2401157' exists in Jenkins Credentials
                    withCredentials([string(credentialsId: 'sonar-token-2401157', variable: 'SONAR_TOKEN')]) {
                        sh """
                            sonar-scanner \
                              -Dsonar.projectKey=2401157_FINAL \
                              -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                              -Dsonar.token=$SONAR_TOKEN \
                              -Dsonar.sources=src \
                              -Dsonar.exclusions=node_modules/**,dist/**
                        """
                    }
                }
            }
        }

        stage('Login to Docker Registry') {
            steps {
                container('dind') {
                    sh '''
                        docker --version
                        sleep 10
                        docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 -u admin -p Changeme@2025
                    '''
                }
            }
        }

        stage('Build - Tag - Push') {
            steps {
                container('dind') {
                    sh '''
                        docker tag project-share-hub:latest \
                          nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401157-project/project-share-hub:latest

                        docker push \
                          nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401157-project/project-share-hub:latest

                        docker pull \
                          nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/2401157-project/project-share-hub:latest

                        docker image ls
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    // Assumes you created a 'k8s' folder with 'deployment.yaml' inside it
                   dir('k8s-deployment') {
                   sh '''
                      kubectl apply -f deployment.yaml -n 2401157
                    '''
                    }
                }
            }
        }

    }
}
