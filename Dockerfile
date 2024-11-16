FROM node:20.12.2-alpine3.18 AS base

# All deps stage
FROM base AS deps
WORKDIR /app
ADD package.json yarn.lock ./
RUN yarn install

# Production only deps stage
FROM base AS production-deps
WORKDIR /app
ADD package.json yarn.lock ./
RUN yarn install --production

# Build stage
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
# FIX-ME: Ignoring TS errors to disable errors arrising from the izzy routes client missing gen route in the build process. 
# Attempted to a step to run the node ace command for izzy, and even directly from the node_modeuls, but ultimately ran into issues of node ace requiring envs.
RUN yarn build --ignore-ts-errors 


# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
EXPOSE 8080
CMD ["node", "./bin/server.js"]
