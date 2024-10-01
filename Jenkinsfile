pipeline {
    agent any
    stages {
        stage('Build') {
            agent{
                docker {
                    image 'node:22-bullseye-slim'
                }
            }
            steps{
                sh 'node --version'
            }
        }
    }
}
