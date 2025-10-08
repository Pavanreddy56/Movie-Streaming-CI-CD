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
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout Source') {
            steps {
                git branch: 'main', url: 'https://github.com/Pavanreddy56/secure-login-cicd.git'
            }
        }

        stage('Backend Build + Test') {
            steps {
                dir('backend') {
                    bat 'mvn -B clean verify'
                }
            }
        }

        
        stage('Build Docker Images') {
            steps {
                script {
                    dir('backend') {
                        bat "docker build -t ${DOCKER_BACKEND}:${IMAGE_TAG} -t ${DOCKER_BACKEND}:latest ."
                    }
                    dir('frontend') {
                        bat "docker build -t ${DOCKER_FRONTEND}:${IMAGE_TAG} -t ${DOCKER_FRONTEND}:latest ."
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                                                  usernameVariable: 'DOCKERHUB_USER',
                                                  passwordVariable: 'DOCKERHUB_PASS')]) {
                    bat "echo %DOCKERHUB_PASS% | docker login -u %DOCKERHUB_USER% --password-stdin"
                    bat "docker push ${DOCKER_BACKEND}:${IMAGE_TAG}"
                    bat "docker push ${DOCKER_BACKEND}:latest"
                    bat "docker push ${DOCKER_FRONTEND}:${IMAGE_TAG}"
                    bat "docker push ${DOCKER_FRONTEND}:latest"
                }
            }
        }


    post {
        success {
            echo "✅ Build ${env.BUILD_NUMBER} succeeded! Website running at http://localhost:3000"
        }
        failure {
            echo "❌ Build ${env.BUILD_NUMBER} failed. Please check logs."
        }
    }
}
