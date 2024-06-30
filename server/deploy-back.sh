#!/bin/bash
REMOTE_USER="maxim"
REMOTE_HOST="139.144.178.100"
REMOTE_DIR_SERVER="/home/maxim/apps/servers/weight-app"
LOCAL_BUILD_DIR_SERVER="/c/projects/_my_projects/my-weight-app/server/bundle"
PM2_PROCESS_NAME="5000-weight-serv"

# Building server
echo -e "\e[36mRunning npm build command (Server)...\e[0m"
npm run build

# Connecting to server
echo -e "\e[36mConnecting to the server...\e[0m"

echo -e "\e[36mStopping PM2 process: ${PM2_PROCESS_NAME}...\e[0m"
pm2 stop ${PM2_PROCESS_NAME}

# Connect to the server via SSH
ssh ${REMOTE_USER}@${REMOTE_HOST} << EOF
echo -e "\e[36mNavigating to project directory and removing existing build directory (Server)...\e[0m"
cd ${REMOTE_DIR_SERVER}
rm dist/bundle/server.bundle.js
EOF

# Copy the build files to the remote server
echo -e "\e[36mCopying build files to the remote server...\e[0m"
scp -r ${LOCAL_BUILD_DIR_SERVER}/server.bundle.js ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR_SERVER}/dist/bundle


# Connect to the server and start the PM2 process
echo -e "\e[36mConnecting to the server and starting PM2 process...\e[0m"
ssh ${REMOTE_USER}@${REMOTE_HOST} << EOF
echo -e "\e[36mStarting PM2 process: ${PM2_PROCESS_NAME}...\e[0m"
pm2 start ${PM2_PROCESS_NAME}
EOF

echo -e "\e[36mBuild process completed and files copied to the server.\e[0m"