# Use an official Node runtime as the base image
FROM node:20-alpine

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY mainResume.json .

# Bundle app source
COPY . .


# Install any needed packages specified in package.json
RUN npm install typescript && npm install

# If you are building your code for production
# RUN npm ci --only=production




# Transpile TypeScript into JavaScript
RUN npm run build

# Remove devDependencies
RUN npm prune --production

# Run the app when the container launches
CMD [ "npm", "start" ]