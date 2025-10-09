pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub-creds'   // Jenkins credential ID
        DOCKERHUB_USER = 'pavanreddych'             // Docker Hub username
        BACKEND_IMAGE = "${env.DOCKERHUB_USER}/movie-backend:${env.BUILD_NUMBER}"
        FRONTEND_IMAGE = "${env.DOCKERHUB_USER}/movie-frontend:${env.BUILD_NUMBER}"
        KUBE_CONTEXT = 'k8s-prod'                   // optional for future deployment
    }

    stages {

        stage('Checkout') {
            steps {
                echo "📦 Checking out source code from GitHub..."
                checkout scm
            }
        }

        stage('Install & Test Dependencies') {
            parallel {
                stage('Backend') {
                    steps {
                        dir('backend') {
                            echo "⚙️ Installing backend dependencies..."
                            sh 'npm install'
                            // sh 'npm test'   // Uncomment if you have backend tests
                        }
                    }
                }

                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            echo "⚙️ Installing frontend dependencies..."
                            sh 'npm install'
                            // sh 'npm test'   // Uncomment if you have frontend tests
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Backend Image') {
                    steps {
                        echo "🐳 Building backend Docker image..."
                        sh "docker build -t ${BACKEND_IMAGE} ./backend"
                    }
                }

                stage('Frontend Image') {
                    steps {
                        echo "🐳 Building frontend Docker image..."
                        sh "docker build -t ${FRONTEND_IMAGE} ./frontend"
                    }
                }
            }
        }

        stage('Trivy Vulnerability Scan') {
            parallel {
                stage('Backend Scan') {
                    steps {
                        echo "🔍 Scanning backend image with Trivy..."
                        sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${BACKEND_IMAGE}"
                    }
                }

                stage('Frontend Scan') {
                    steps {
                        echo "🔍 Scanning frontend image with Trivy..."
                        sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${FRONTEND_IMAGE}"
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo "🚀 Pushing Docker images to Docker Hub..."
                withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    sh "docker push ${BACKEND_IMAGE}"
                    sh "docker push ${FRONTEND_IMAGE}"
                }
            }
        }

    } // end stages

    post {
        always {
            sh 'docker logout || true'
            echo "🧹 Docker logout done."
        }
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed. Check the logs."
        }
    }
}
