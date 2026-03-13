pipeline {
    agent any

        environment {
	        IMAGE_NAME = "akilaraamana/nodejs-demo-docker:latest"
		        DOCKERHUB_CREDENTIALS = "dockerhub-token"
	    	    }
		    stages {

		        stage('Checkout Code') {
		                steps {
		       	                git branch: 'main',
		                        url: 'https://github.com/AkilaRajkumar/nodejs-ci-cd-demo.git'
			               }
				 }
		         stage('Install Dependencies') {
	           	         steps {
			                 bat 'npm install'
				       }
			         }
			stage('Run Test') {
			         steps {
				          bat 'npm test'
				       }
				 }
		        stage('SonarQube Analysis') {
   		                 steps {
			                   withSonarQubeEnv('sonarqube-server') {					 					   bat 'sonar-scanner' }
																                                }
																			      }
																			      stage('Quality Gate') {
																			                  steps {
																					                  timeout(time: 5, unit: 'MINUTES') {																							                      waitForQualityGate abortPipeline: true
																									                      }
																								             }
																								        }
													 					          stage('Build Docker Image') {													              steps {
																			                      bat 'docker build -t %IMAGE_NAME% .'																								                  }
																				          }
																			stage('Push Docker Image') {
																			          steps {
																			              withCredentials([usernamePassword(
																		                     credentialsId: 'dockerhub-token',
       		                         usernameVariable: 'USERNAME',
		                     passwordVariable: 'PASSWORD')]) {
				                         bat 'docker login -u %USERNAME% -p %PASSWORD%'
				                     bat 'docker push %IMAGE_NAME%'
																					                     }
																				                 }
																				         }

				         stage('Deploy Container') {
					             steps {
				                     bat '''
																                     docker stop nodejs-demo
	                     docker rm nodejs-demo
	                     docker run -d -p 3000:3000 --name nodejs-demo akilaraamana/nodejs-demo-docker:latest
																			                     '''
					                 }
					         }
					     }
			     }
