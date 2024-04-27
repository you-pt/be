# # Base image
# FROM node:18-alpine
# # AS development

# # Create app directory
# WORKDIR /usr/src/app

# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./

# # Bundle app source
# COPY . .

# # Install app dependencies
# RUN npm install

# # Creates a "dist" folder with the production build
# RUN npm run build
# # AS production
# FROM node:18 AS production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app

# COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
# COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# COPY --from=alpine /usr/src/app ./
# # --from=alpine development
# EXPOSE 3001

FROM node:18-alpine AS base

# INSTALL DEPENDENCIES FOR DEVELOPMENT (FOR NEST)
FROM base AS deps
WORKDIR /usr/src/app

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

USER node

# INSTALL DEPENDENCIES & BUILD FOR PRODUCTION
FROM base AS build
WORKDIR /usr/src/app

COPY --chown=node:node --from=deps /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production
RUN npm ci --production;
RUN rm -rf ./.next/cache

USER node

# PRODUCTION IMAGE
FROM base AS production
WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD ["npm", "run", "start:dev"]
