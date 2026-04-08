pipeline {
    agent any

    environment {
        IMAGE_NAME = "akilaraamana/capstone_project:latest"
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

        stage('Build Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Push Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-token',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh '''
                    docker login -u $USER -p $PASS
                    docker push $IMAGE_NAME
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh '''
                ssh -o StrictHostKeyChecking=no -i $EC2_KEY $EC2_USER@$EC2_HOST "
                    docker pull akilaraamana/capstone_project:latest &&
                    docker stop capstone || true &&
                    docker rm capstone || true &&
                    docker run -d -p 3001:3000 --name capstone akilaraamana/capstone_project:latest
                "
                '''
            }
        }
    }
}
