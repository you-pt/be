# Base image
FROM node:18 AS development

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Bundle app source
COPY . .

# Install app dependencies
RUN npm install

# Creates a "dist" folder with the production build
RUN npm run build
# AS production
FROM node:18-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=development /usr/src/app ./

EXPOSE 3000

# Start the server using the production build
CMD ["npm", "run", "start:dev"]
