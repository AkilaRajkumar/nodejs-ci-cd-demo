pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "akilaraamana/nodejs-demo:${BUILD_NUMBER}"
        DOCKER_CREDENTIALS = "dockerhub-token"
        EC2_HOST = "ec2-13-234-238-147.ap-south-1.compute.amazonaws.com"
        EC2_USER = "ubuntu"
        EC2_KEY = "/var/lib/jenkins/ec2-key.pem"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/AkilaRajkumar/nodejs-ci-cd-demo.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test || true'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'sonar-scanner'
                    withSonarQubeEnv('sonarqube-server') {
                        sh "${scannerHome}/bin/sonar-scanner"
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
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-token',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                )]) {
                    sh '''
                    docker login -u $USERNAME -p $PASSWORD
                    docker push $DOCKER_IMAGE
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh '''
                ssh -o StrictHostKeyChecking=no -i $EC2_KEY $EC2_USER@$EC2_HOST "
                    docker pull $DOCKER_IMAGE &&
                    docker stop nodejs-demo || true &&
                    docker rm nodejs-demo || true &&
                    docker run -d -p 3000:3000 --name nodejs-demo $DOCKER_IMAGE
                "
                '''
            }
        }
    }
}
