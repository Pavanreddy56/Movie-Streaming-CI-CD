pipeline {
    agent any

    environment {
        IMAGE_TAG        = "${env.BUILD_NUMBER}"
        DOCKER_BACKEND   = "pavanreddych/movie-backend"
        DOCKER_FRONTEND  = "pavanreddych/movie-frontend"
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Pavanreddy56/Movie-Streaming-CI-CD.git'
            }
        }

        stage('Backend & Frontend Build') {
            parallel {
                stage('Backend Build') {
                    steps {
                        dir('backend') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Frontend Build') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Trivy Security Scan') {
            steps {
                sh 'trivy fs . --severity HIGH,CRITICAL || true'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    dir('backend') {
                        sh "docker build -t ${DOCKER_BACKEND}:${IMAGE_TAG} -t ${DOCKER_BACKEND}:latest ."
                    }
                    dir('frontend') {
                        sh "docker build -t ${DOCKER_FRONTEND}:${IMAGE_TAG} -t ${DOCKER_FRONTEND}:latest ."
                    }
                }
            }
        }

        stage('Local Test Run') {
            steps {
                script {
                    echo "🧪 Running containers locally for verification..."
                    sh "docker compose up -d"
                    sh "sleep 10"
                    sh "docker ps"
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                                                  usernameVariable: 'DOCKERHUB_USER',
                                                  passwordVariable: 'DOCKERHUB_PASS')]) {
                    sh '''
                    echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin
                    docker push ${DOCKER_BACKEND}:${IMAGE_TAG}
                    docker push ${DOCKER_BACKEND}:latest
                    docker push ${DOCKER_FRONTEND}:${IMAGE_TAG}
                    docker push ${DOCKER_FRONTEND}:latest
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD pipeline completed successfully!"
            echo "Backend: ${DOCKER_BACKEND}:${IMAGE_TAG}"
            echo "Frontend: ${DOCKER_FRONTEND}:${IMAGE_TAG}"
        }
        failure {
            echo "❌ Pipeline failed. Check Jenkins logs for errors."
        }
        always {
            sh 'docker compose down || true'
            cleanWs()
        }
    }
}

