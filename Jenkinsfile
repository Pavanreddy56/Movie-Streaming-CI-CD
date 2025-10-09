pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = 'dockerhub-creds'    // Jenkins credential ID (username/password)
    DOCKERHUB_USER = 'pavanreddych'              // your Docker Hub username
    BACKEND_IMAGE = "${env.DOCKERHUB_USER}/movie-backend:${env.BUILD_NUMBER}"
    FRONTEND_IMAGE = "${env.DOCKERHUB_USER}/movie-frontend:${env.BUILD_NUMBER}"
    KUBE_CONTEXT = 'k8s-prod'                    // optional (for future deployment)
  }

  stages {

    stage('Checkout') {
      steps {
        echo "📦 Checking out source code from GitHub..."
        checkout scm
      }
    }

    stage('Install & Test (Backend)') {
      steps {
        echo "⚙️ Installing backend dependencies..."
        dir('backend') {
          sh 'npm install'
          // Run backend tests if needed:
          // sh 'npm test'
        }
      }
    }

    stage('Install & Test (Frontend)') {
      steps {
        echo "⚙️ Installing frontend dependencies..."
        dir('frontend') {
          sh 'npm install'
          // Run frontend tests if needed:
          // sh 'npm test'
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        echo "🐳 Building Docker images for backend and frontend..."
        script {
          sh "docker build -t ${BACKEND_IMAGE} ./backend"
          sh "docker build -t ${FRONTEND_IMAGE} ./frontend"
        }
      }
    }

    stage('Trivy Scan') {
      steps {
        echo "🔍 Running Trivy vulnerability scans..."
        script {
          // Ensure Trivy is installed on the Jenkins agent
          sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${BACKEND_IMAGE} || true"
          sh "trivy image --exit-code 1 --severity HIGH,CRITICAL ${FRONTEND_IMAGE} || true"
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
      echo "🧹 Cleanup done. Docker logged out."
    }
    success {
      echo "✅ Pipeline completed successfully!"
    }
    failure {
      echo "❌ Pipeline failed. Check logs for details."
    }
  }
}
