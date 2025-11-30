# Dockerfile for running Expo dev server inside a container
# Uses Node LTS and runs the project's start script (expo start)

FROM node:18-bullseye-slim

# Install git (some packages may require it)
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# copy package manifests first to install dependencies
COPY package.json package-lock.json* ./

# Use npm ci for reproducible installs
RUN npm ci --no-audit --prefer-offline

# copy rest of project
COPY . .

# Bind devtools to 0.0.0.0 so they are reachable from host
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

# Expose common Expo/Metro ports
EXPOSE 19000 19001 8081 3000

# Default command: run the project's start script
CMD ["npm", "start"]
