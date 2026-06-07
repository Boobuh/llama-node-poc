# Use official Node.js runtime as base image
FROM node:22-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --omit=dev

# Copy application code and build
COPY . .
RUN npm run build

# Create models directory
RUN mkdir -p models

# Expose port (if needed for future web interface)
EXPOSE 3000

# Default command
CMD ["node", "dist/index.js", "--help"]

# Instructions for running with Docker
# 1. Build: docker build -t llama-node-poc .
# 2. Run basic: docker run -v $(pwd)/models:/app/models llama-node-poc node dist/index.js basic
# 3. Interactive: docker run -it -v $(pwd)/models:/app/models llama-node-poc node dist/index.js chat
