# Use the official Node.js image as a base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./
COPY prisma ./prisma/

# Install project dependencies using Yarn
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Build the NestJS application
RUN yarn build


# Define the command to run your NestJS application
CMD ["yarn", "start:migrate:prod"]
