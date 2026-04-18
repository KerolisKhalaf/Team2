pipeline {

    agent any

    environment {
        registryCredential = 'dockerhub_id'
        DOCKER_REGISTRY = 'https://registry.hub.docker.com'
        NODEJS_HOME = tool 'node18'
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
    }

    stages {

        stage('Git Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/Antonios-Reda/Team2.git'
            }
        }

        stage('Install dependencies') {
            steps {
                sh '''
                set -e
                cd Backend
                npm ci

                cd ../Ng-frontend
                npm ci

                cd ../WebRTC_Signaling_Server
                npm ci
                '''
            }
        }

        stage('Test') {
            steps {
                sh 'cd Backend/ && cp .env_test .env && NODE_ENV=test npm test'
            }
        }

        stage('Build') {
            steps {
                sh '''
                set -e
                cd Backend
                cp .env_deploy .env

                cd ../Ng-frontend
                npx ng build --configuration production

                cd ../WebRTC_Signaling_Server
                npm run build || true
                '''
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
                sh '''
                docker tag telemedicine_webrtc_server antoniosreda/telemedicine_webrtc_server:${BUILD_NUMBER}
                docker tag telemedicine_frontend antoniosreda/telemedicine_frontend:${BUILD_NUMBER}
                docker tag telemedicine_backend antoniosreda/telemedicine_backend:${BUILD_NUMBER}
                '''
            }
        }

        stage('Deploy on Docker Hub') {
            steps {
                script {
                    docker.withRegistry(DOCKER_REGISTRY, registryCredential) {
                        sh '''
                        docker push antoniosreda/telemedicine_webrtc_server:${BUILD_NUMBER}
                        docker push antoniosreda/telemedicine_frontend:${BUILD_NUMBER}
                        docker push antoniosreda/telemedicine_backend:${BUILD_NUMBER}
                        '''
                    }
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                ansiblePlaybook(
                    installation: 'Ansible',
                    inventory: './ansible_deployment/ansible_inventory',
                    playbook: './ansible_deployment/ansible_deploy.yml',
                    colorized: true,
                    disableHostKeyChecking: true
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