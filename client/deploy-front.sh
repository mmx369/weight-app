#!/bin/bash

# Server details
REMOTE_USER="maxim"
REMOTE_HOST="139.144.178.100"
REMOTE_DIR_FRONT="/var/www/html/weight-app"
LOCAL_BUILD_DIR_FRONT="/c/projects/_my_projects/my-weight-app/client/build"

echo -e "\e[36mBuild process started....\e[0m"

# Navigate to the local project directory and build client
cd ./client
echo -e "\e[36mRunning npm build command...\e[0m"
npm run build

# Connecting to server and remove old build
echo -e "\e[36mConnecting to the server...\e[0m"
Connect to the server via SSH
ssh ${REMOTE_USER}@${REMOTE_HOST} << EOF
echo -e "\e[36mNavigating to project directory and removing existing build directory...\e[0m"
cd ${REMOTE_DIR_FRONT}
rm -rf build
EOF

# Copy new build to the remote server
Copy the build files to the remote server
echo -e "\e[36mCopying build files to the remote server...\e[0m"
scp -r ${LOCAL_BUILD_DIR_FRONT} ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR_FRONT}/build

echo -e "\e[36mBuild process completed and files copied to the server.\e[0m"







