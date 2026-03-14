pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "akilaraamana/nodejs-demo"
        DOCKER_CREDENTIALS = "dockerhub-token"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/AkilaRajkumar/nodejs-ci-cd-demo.git'
            }
        }

        stage('Build') {
            steps {
                bat 'npm install'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test'
            }
        }

        
        stage('SonarQube Analysis') {
    steps {
        script {
            def scannerHome = tool 'sonar-scanner'
            withSonarQubeEnv('sonarqube-server') {
                bat "${scannerHome}\\bin\\sonar-scanner"
            }
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
                bat 'docker build -t %DOCKER_IMAGE% .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-token',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                )]) {

                    bat 'docker login -u %USERNAME% -p %PASSWORD%'
                    bat 'docker push %DOCKER_IMAGE%'
                }
            }
        }

        stage('Deploy Container') {
            steps {
                bat '''
                docker stop nodejs-demo
                docker rm nodejs-demo
                docker run -d -p 3000:3000 --name nodejs-demo %DOCKER_IMAGE%
                '''
            }
        }
    }
}
