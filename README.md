# Dev Guide

## Join the Linear Project:
[Linear Signup Link](https://linear.app/reachai/join/ebdf66a96b63ba4de5a9006eecda14b1?s=4).

- After clicking on an open issue, CMD + Shift + . will copy the issue name.
- Creating a new bran

## This Repo contains submodules:

- To properly clone all resources run:
```sh
git clone --recurse-submodules https://github.com/willgbryan/REACH.git
```
- If you have already cloned the repo without the submodules you can run:
```sh
git submodule update --init --recursive
```

## Prerequisites

1. **Docker Desktop**: You will need Docker Desktop installed to manage the Docker containers. 
2. **Docker Compose**: Docker Compose is used for defining and running multi-container Docker applications.

## Installations

### Step 1: Install Docker Desktop

- **Windows/Mac**: Download and install Docker Desktop from [Docker Hub](https://www.docker.com/products/docker-desktop).
- **Linux**: Follow the instructions on the Docker website to install Docker Engine and Docker Compose separately. You can find the instructions here: [Install Docker on Linux](https://docs.docker.com/engine/install/).

### Step 2: Install Docker Compose

- **Windows/Mac**: Docker Compose is included with Docker Desktop installations.
- **Linux**: If you haven't already installed Docker Compose during the Docker setup, you can follow the instructions here: [Install Docker Compose](https://docs.docker.com/compose/install/).

## Configuration

### Environment Variables

1. **Configure SEARX_HOST**
   - Set the `SEARX_HOST` environment variable to point to the local SearxNG instance:
   ```sh
   export SEARX_HOST=http://searxng:8080
   ```
2. Set OPENAI_API_KEY (Easiest way to test new app functions)
   - You will need to provide your OpenAI API key. Set the OPENAI_API_KEY environment variable:
   ```sh
   export OPENAI_API_KEY=your_openai_api_key_here
   ```
   
## Running the Project
Once Docker and the environment variables are set, you can build and run your project using Docker Compose.

### Build the Docker Containers
   - Navigate to the root of the project where your docker-compose.yml file is located and run:
   ```sh
   docker compose build
   ```
### Start the Application
   - To start the application, run:
   ```sh
   docker compose up -d
   ```
   - This command will start all the services defined in your docker-compose.yml file. You can access the application as specified in your configuration.

### Stopping the Application
   - To stop your Docker containers, you can use the following command:
   ```sh
   docker compose down
   ```
   - This will stop and remove all the containers, networks, and volumes created by docker compose up.

## Additional Notes
   - Ensure that the ports defined in the docker-compose.yml are available on your machine.
   - For changes to environment variables to take effect, you may need to restart Docker Desktop.
   - Running the following every so often will trim dangling images and unused build caches:
   ```sh
   docker system prune
   ```
## Using a custom .gguf model with Ollama
   - Download the model weights from huggingface and copy them into the root of the project.
   - Mount the model weights to the Docker image in the `docker-compose.yml`. An example is included in the file.
   - Modify the `Modelfile` to reflect the path to the mounted model weights.
   - Ensure `config.py` has the following set for the models and providers:
   ```python
      self.embedding_provider = os.getenv("EMBEDDING_PROVIDER", "ollama")
      self.llm_provider = os.getenv("LLM_PROVIDER", "ollama")
         self.fast_llm_model = os.getenv(
               "FAST_LLM_MODEL", "<build name from ollama build>"
         )
         self.smart_llm_model = os.getenv(
               "SMART_LLM_MODEL", "<build name from ollama build>"
         )
   ```
   - Fire up the containers with `docker compose build` and then `docker compose up -d`
   - Navigate to the ollama container `exec` tab and run:
   ```sh
   ollama create <build name from ollama build> -f Modelfile
   ```
   
