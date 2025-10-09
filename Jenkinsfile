pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = 'dockerhub-creds'    // Jenkins credential id (username/password)
    DOCKERHUB_USER = 'pavanreddych'              // replace with your Docker Hub username
    BACKEND_IMAGE = "${env.DOCKERHUB_USER}/movie-backend:${env.BUILD_NUMBER}"
    FRONTEND_IMAGE = "${env.DOCKERHUB_USER}/movie-frontend:${env.BUILD_NUMBER}"
    KUBE_CONTEXT = 'k8s-prod'                    // optional
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Test (Backend)') {
      steps {
        dir('backend') {
          sh 'npm ci'
          // Add tests if required: sh 'npm test'
        }
      }
    }

    stage('Install & Test (Frontend)') {
      steps {
        dir('frontend') {
          sh 'npm ci'
          // Add tests if required: sh 'npm test'
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        script {
          sh "docker build -t ${BACKEND_IMAGE} ./backend"
          sh "docker build -t ${FRONTEND_IMAGE} ./frontend"
        }
      }
    }

    stage('Trivy Scan') {
      steps {
        script {
          // Make sure trivy is installed on the Jenkins agent
          sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${BACKEND_IMAGE} || true"
          sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${FRONTEND_IMAGE} || true"
          // Note: above returns non-zero if vulnerabilities are found; adjust as needed
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
          sh "docker push ${BACKEND_IMAGE}"
          sh "docker push ${FRONTEND_IMAGE}"
        }
      }
    }
  }

  post {
    always {
      sh 'docker logout || true'
    }
    success {
      echo "✅ Pipeline succeeded."
    }
    failure {
      echo "❌ Pipeline failed."
    }
  }
}
