#!/bin/bash

installerUrl="https://desktop.docker.com/mac/stable/Docker.dmg"
installerPath="/tmp/Docker.dmg"
dirPath="/tmp/DockerApp"

mkdir -p "$dirPath"

echo "Downloading Docker for Mac..."
curl -L "$installerUrl" -o "$installerPath"

echo "Mounting Docker image..."
hdiutil attach "$installerPath"

echo "Installing Docker..."
cp -R /Volumes/Docker/*.app /Applications

echo "Docker installed."

composeFile="$dirPath/docker-compose.yml"
cat > "$composeFile" <<EOF
version: '3'
services:
  ollama:
    image: ollama/ollama:latest
    ports: 
      - "11434:11434"
    networks:
      - reach
  searxng:
    image: searxng/searxng:latest
    volumes:
      - ./searxng/settings.yml:/etc/searxng/settings.yml
    ports:
      - "8080:8080"
    networks:
      - reach
  reach:
    build: .
    image: reach13/reach:latest
    volumes:
      - ./frontend:/usr/src/app/frontend
      - ./reach_core:/usr/src/app/reach_core
    ports:
      - "8000:8000"
    networks:
      - reach

networks:
  reach:
    driver: bridge
EOF

echo "Docker Compose file created."

export SEARX_HOST="http://searxng:8080"
export OPENAI_API_KEY="ADD VALUE" # Replace ADD VALUE with your actual API key

echo "Environment variables configured."

echo "Building Docker Compose project..."
(cd "$dirPath" && docker-compose build)
echo "Docker Compose project built."

echo "Starting the application..."
(cd "$dirPath" && docker-compose up -d)
echo "Application is running."

echo "Installation and setup complete!"