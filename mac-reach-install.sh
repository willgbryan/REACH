#!/bin/bash

dirPath="/Users/$(whoami)/reach-app-001"

mkdir -p "$dirPath"

composeContent=$(cat <<EOF
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
    environment:
      SEARXNG_SECRET: "STLsecret"
    ports:
      - "8080:8080"
    networks:
      - reach
  reach:
    image: reach13/reach:latest
    environment:
      SEARX_URL: "http://searxng:8080"
      OPENAI_API_KEY: "<key>"
    ports:
      - "8000:8000"
    networks:
      - reach

networks:
  reach:
    driver: bridge
EOF
)

echo "$composeContent" > "$dirPath/docker-compose.yml"
echo "Docker Compose file created."

echo "Environment variables configured."

cd "$dirPath"

echo "Building Docker Compose project..."
docker-compose build
echo "Docker Compose project built."

echo "Starting the application..."
docker-compose up -d
echo "Application is running."

echo "Installation and setup complete!"