# Use an official Node runtime as the base image
FROM node:20-buster

# Install required dependencies
RUN apt-get update && apt-get install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget \
    libgbm-dev


# Make port 3000 available to the world outside this container
EXPOSE 3000

# Adding typescript installation first
RUN npm install -g typescript

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN npm ci
COPY mainResume.json .

# Bundle app source
COPY . .



# If you are building your code for production
# RUN npm ci --only=production




# Transpile TypeScript into JavaScript
RUN npm run build

# Remove devDependencies
RUN npm prune --production

# You might have other files or directories to remove depending on your project structure
RUN rm -rf *.ts tsconfig.json


# Run the app when the container launches
CMD [ "npm", "start" ]