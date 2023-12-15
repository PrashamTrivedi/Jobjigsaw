# Use an official Node runtime as the base image
FROM node:20-alpine

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Adding typescript installation first
RUN npm install -g typescript

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN npm ci
# COPY mainResume.json .

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