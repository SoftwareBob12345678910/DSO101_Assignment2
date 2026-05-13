pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    environment {
        BACKEND_DIR = 'backend'
        FRONTEND_DIR = 'frontend'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '========== Checking out code from GitHub =========='
                checkout scm
            }
        }
        
        stage('Backend - Install Dependencies') {
            steps {
                echo '========== Installing backend dependencies =========='
                dir("${BACKEND_DIR}") {
                    bat 'npm install'
                }
            }
        }
        
        stage('Frontend - Install Dependencies') {
            steps {
                echo '========== Installing frontend dependencies =========='
                dir("${FRONTEND_DIR}") {
                    bat 'npm install'
                }
            }
        }
        
        stage('Backend - Build') {
            steps {
                echo '========== Building backend =========='
                dir("${BACKEND_DIR}") {
                    bat 'echo Backend is Node.js Express app - no build step needed'
                }
            }
        }
        
        stage('Frontend - Build') {
            steps {
                echo '========== Building frontend React app =========='
                dir("${FRONTEND_DIR}") {
                    bat 'npm run build'
                }
            }
        }
        
        stage('Backend - Unit Tests') {
            steps {
                echo '========== Running backend unit tests =========='
                dir("${BACKEND_DIR}") {
                    bat 'npm test -- --passWithNoTests'
                }
            }
            post {
                always {
                    junit testResults: '${BACKEND_DIR}/junit.xml', 
                          allowEmptyResults: true
                }
            }
        }
        
        stage('Frontend - Unit Tests') {
            steps {
                echo '========== Running frontend unit tests =========='
                dir("${FRONTEND_DIR}") {
                    bat 'npm test -- --passWithNoTests --ci --coverage'
                }
            }
            post {
                always {
                    junit testResults: '${FRONTEND_DIR}/junit.xml', 
                          allowEmptyResults: true
                }
            }
        }
        
        stage('Deploy - Push to Docker Hub') {
            when {
                branch 'main'
            }
            steps {
                echo '========== Building and pushing Docker images =========='
                script {
                    // Build and push backend image
                    dir("${BACKEND_DIR}") {
                        bat '''
                            echo Building backend Docker image...
                            docker build -t %DOCKER_USERNAME%/todo-backend:latest .
                        '''
                    }
                    
                    // Build and push frontend image
                    dir("${FRONTEND_DIR}") {
                        bat '''
                            echo Building frontend Docker image...
                            docker build -t %DOCKER_USERNAME%/todo-frontend:latest .
                        '''
                    }
                    
                    // Push images to Docker Hub
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        bat '''
                            echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin
                            docker push %DOCKER_USERNAME%/todo-backend:latest
                            docker push %DOCKER_USERNAME%/todo-frontend:latest
                            docker logout
                            echo Docker images pushed successfully!
                        '''
                    }
                }
            }
        }
        
        stage('Deployment Complete') {
            steps {
                echo '========== Pipeline Completed Successfully =========='
                echo '✅ All stages passed!'
                echo 'Backend container: ${DOCKER_USERNAME}/todo-backend:latest'
                echo 'Frontend container: ${DOCKER_USERNAME}/todo-frontend:latest'
            }
        }
    }
    
    post {
        success {
            echo '✅ BUILD AND TESTS PASSED SUCCESSFULLY!'
        }
        failure {
            echo '❌ BUILD OR TESTS FAILED - CHECK LOGS ABOVE'
        }
        always {
            echo '========== Pipeline Finished =========='
        }
    }
}
