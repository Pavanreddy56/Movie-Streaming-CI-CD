pipeline {
    agent any

    tools {
        maven 'Maven3'
        jdk 'JDK17'
    }

    environment {
        SONARQUBE_SERVER = 'SonarQube'
        IMAGE_TAG        = "${env.BUILD_NUMBER}"
        DOCKER_BACKEND   = "pavanreddych/pdf-portal-backend"
        DOCKER_FRONTEND  = "pavanreddych/pdf-portal-frontend"
    }

    options {
        skipDefaultCheckout(true)
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout Source') {
            steps {
                echo "📦 Checking out source code..."
                git branch: 'main', url: 'https://github.com/Pavanreddy56/Movie-Streaming-CI-CD.git'
            }
        }

        stage('Code Quality - SonarQube') {
            steps {
                echo "🔍 Running SonarQube Analysis..."
                withSonarQubeEnv("${SONARQUBE_SERVER}") {
                    dir('backend') {
                        sh 'mvn clean verify sonar:sonar -DskipTests=true'
                    }
                }
            }
        }

        stage('Backend & Frontend Build') {
            parallel {
                stage('Backend Build') {
                    steps {
                        dir('backend') {
                            echo "⚙️ Building Backend..."
                            sh 'mvn clean package -DskipTests=true'
                        }
                    }
                }
                stage('Frontend Build') {
                    steps {
                        dir('frontend') {
                            echo "🖥️ Building Frontend..."
                            sh 'npm install'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Security Scan - Trivy') {
            steps {
                script {
                    echo "🛡️ Running Trivy Security Scan..."
                    sh 'trivy fs . --severity HIGH,CRITICAL || true'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    echo "🐳 Building Docker Images..."
                    dir('backend') {
                        sh "docker build -t ${DOCKER_BACKEND}:${IMAGE_TAG} -t ${DOCKER_BACKEND}:latest ."
                    }
                    dir('frontend') {
                        sh "docker build -t ${DOCKER_FRONTEND}:${IMAGE_TAG} -t ${DOCKER_FRONTEND}:latest ."
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                                                  usernameVariable: 'DOCKERHUB_USER',
                                                  passwordVariable: 'DOCKERHUB_PASS')]) {
                    script {
                        echo "📤 Pushing Docker Images to DockerHub..."
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

        stage('Manual Deployment Notice') {
            steps {
                echo "🧭 Manual Deployment Step: Run this on your Docker host"
                echo "------------------------------------------------------"
                echo "docker pull ${DOCKER_BACKEND}:latest"
                echo "docker pull ${DOCKER_FRONTEND}:latest"
                echo "docker run -d -p 8080:8080 ${DOCKER_BACKEND}:latest"
                echo "docker run -d -p 3000:3000 ${DOCKER_FRONTEND}:latest"
                echo "------------------------------------------------------"
            }
        }
    }

    post {
        success {
            echo "✅ Build ${env.BUILD_NUMBER} succeeded! Images pushed to DockerHub."
        }
        failure {
            echo "❌ Build ${env.BUILD_NUMBER} failed. Check console logs for details."
        }
        always {
            cleanWs()
        }
    }
}

