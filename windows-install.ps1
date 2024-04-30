$dockerPath = Get-Command "docker" -ErrorAction SilentlyContinue

if ($dockerPath -eq $null) {
    Write-Output "Docker Desktop is not installed. Proceeding with installation..."

    $installerUrl = "https://desktop.docker.com/win/stable/Docker%20Desktop%20Installer.exe"
    $installerPath = "C:\Temp\DockerDesktopInstaller.exe"

    New-Item -ItemType Directory -Force -Path "C:\Temp"

    Write-Output "Downloading Docker Desktop installer..."
    Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath

    Write-Output "Starting Docker Desktop installation..."
    Start-Process -FilePath $installerPath -ArgumentList "install --quiet" -NoNewWindow -Wait
    Write-Output "Docker Desktop installed."
} else {
    Write-Output "Docker Desktop is already installed."
}

$dirPath = "C:\DockerApp"
New-Item -ItemType Directory -Force -Path $dirPath
$composeContent = @"
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
      # - ./reach-react-app:/usr/src/app/react_app
      - ./frontend:/usr/src/app/frontend
      - ./reach_core:/usr/src/app/reach_core
    ports:
      - "8000:8000"
    networks:
      - reach

networks:
  reach:
    driver: bridge

"@
$composeFile = Join-Path -Path $dirPath -ChildPath "docker-compose.yml"
$composeContent | Out-File -FilePath $composeFile
Write-Output "Docker Compose file created."

[System.Environment]::SetEnvironmentVariable("SEARX_HOST", "http://searxng:8080", [System.EnvironmentVariableTarget]::Machine)
[System.Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "ADD VALUE", [System.EnvironmentVariableTarget]::Machine)
Write-Output "Environment variables configured."

Write-Output "Building Docker Compose project..."
Set-Location -Path $dirPath
docker-compose build
Write-Output "Docker Compose project built."

Write-Output "Starting the application..."
docker-compose up -d
Write-Output "Application is running."

Write-Output "Installation and setup complete!"
