# Use a base image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the backend port
EXPOSE 5000

# Define environment variable (optional)
ENV NODE_ENV production

# Command to start the server
CMD ["npm", "start"]
