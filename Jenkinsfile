pipeline {

    agent any

    tools {
        nodejs 'node18'
    }

    environment {
        registryCredential = 'dockerhub_id'
        DOCKER_REGISTRY = 'https://registry.hub.docker.com'
    }

    stages {

        stage('Git Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/KerolisKhalaf/Team2.git'
            }
        }

        stage('Install dependencies') {
            steps {
                sh '''
                set -e
                cd Backend && npm ci
                cd ../Ng-frontend && npm ci
                cd ../WebRTC_Signaling_Server && npm ci
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                cd Backend
                cp .env_test .env
                NODE_ENV=test npm test
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                set -e
                cd Backend && cp .env_deploy .env
                cd ../Ng-frontend && npm run build
                cd ../WebRTC_Signaling_Server && npm run build || true
                '''
            }
        }

        stage('Docker Containerization') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy on Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub_id', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                    echo $PASS | docker login -u $USER --password-stdin

                    docker push keroliskhalaf1/telemedicine_webrtc_server:${BUILD_NUMBER}
                    docker push keroliskhalaf1/telemedicine_frontend:${BUILD_NUMBER}
                    docker push keroliskhalaf1/telemedicine_backend:${BUILD_NUMBER}
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
