pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "yourdockerhubusername/yourapp"
        DOCKER_CREDENTIALS_ID = "dockerhub"
    }

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/yourusername/yourrepo.git'
            }
        }

        stage('Code Quality - SonarQube') {
            steps {
                script {
                    sh 'echo "Running SonarQube Scan..."'
                    // Example: sonar-scanner -Dsonar.projectKey=myproject -Dsonar.host.url=http://<your-sonarqube-ip>:9000 -Dsonar.login=<token>
                }
            }
        }

        stage('Security Scan - Trivy') {
            steps {
                script {
                    sh 'trivy fs . || true'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t $DOCKER_IMAGE:latest .'
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: "$DOCKER_CREDENTIALS_ID", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    docker push $DOCKER_IMAGE:latest
                    '''
                }
            }
        }

        stage('Post Build Info') {
            steps {
                echo "Docker image pushed: $DOCKER_IMAGE:latest"
                echo "You can deploy manually using Docker run."
            }
        }
    }
}
