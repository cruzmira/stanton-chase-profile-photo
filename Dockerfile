# ---- Build Stage ----
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install ALL dependencies (including devDependencies for build)
COPY cbre---profile-photo/package.json cbre---profile-photo/package-lock.json ./
RUN npm ci

# Copy source code and build
COPY cbre---profile-photo/ .
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

# Copy only what's needed for production
COPY cbre---profile-photo/package.json cbre---profile-photo/package-lock.json ./
RUN npm ci --omit=dev

# Copy built frontend from build stage
COPY --from=build /app/dist ./dist

# Copy server
COPY cbre---profile-photo/server.js ./

# Copy public assets (logos etc.)
COPY cbre---profile-photo/public ./public

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "server.js"]
