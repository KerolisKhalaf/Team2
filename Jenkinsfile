pipeline {

    environment {
        registryCredential = 'dockerhub_id'
        DOCKER_REGISTRY = 'https://registry.hub.docker.com'
    }

    agent any

    stages {

        stage('Git Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/Antonios-Reda/Team2.git'
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'cd Backend/ && npm ci'
                sh 'cd Ng-frontend/ && npm ci'
                sh 'cd WebRTC_Signaling_Server/ && npm ci'
            }
        }

        stage('Test') {
            steps {
                sh 'cd Backend/ && cp .env_test .env && npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'cd Backend/ && cp .env_deploy .env'
                sh 'cd Ng-frontend/ && npx ng build'
                sh 'cd WebRTC_Signaling_Server/ && npm run build || true'
            }
        }

        stage('Remove Previous Docker Images If Exists') {
            steps {
                sh '''
                docker rmi telemedicine_webrtc_server telemedicine_frontend telemedicine_backend 2>/dev/null || true
                docker rmi antoniosreda/telemedicine_webrtc_server antoniosreda/telemedicine_frontend antoniosreda/telemedicine_backend 2>/dev/null || true
                '''
            }
        }

        stage('Docker Containerization') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Tag Docker Images') {
            steps {
                sh 'docker tag telemedicine_webrtc_server antoniosreda/telemedicine_webrtc_server:${BUILD_NUMBER}'
                sh 'docker tag telemedicine_frontend antoniosreda/telemedicine_frontend:${BUILD_NUMBER}'
                sh 'docker tag telemedicine_backend antoniosreda/telemedicine_backend:${BUILD_NUMBER}'
            }
        }

        stage('Deploy on Docker Hub') {
            steps {
                script {
                    docker.withRegistry(DOCKER_REGISTRY, registryCredential) {
                        sh 'docker push antoniosreda/telemedicine_webrtc_server:${BUILD_NUMBER}'
                        sh 'docker push antoniosreda/telemedicine_frontend:${BUILD_NUMBER}'
                        sh 'docker push antoniosreda/telemedicine_backend:${BUILD_NUMBER}'
                    }
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                ansiblePlaybook(
                    becomeUser: null,
                    colorized: true,
                    disableHostKeyChecking: true,
                    installation: 'Ansible',
                    inventory: './ansible_deployment/ansible_inventory',
                    playbook: './ansible_deployment/ansible_deploy.yml'
                )
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}