pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "yourdockerhubusername/nodejs-demo"
        DOCKER_CREDENTIALS = "dockerhub-token"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/YOUR_USERNAME/nodejs-ci-cd-demo.git'
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube-server') {
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-token',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD')]) {

                    sh 'docker login -u $USERNAME -p $PASSWORD'
                    sh 'docker push $DOCKER_IMAGE'
                }
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker stop nodejs-demo || true
                docker rm nodejs-demo || true
                docker run -d -p 3000:3000 --name nodejs-demo $DOCKER_IMAGE
                '''
            }
        }
    }
}
