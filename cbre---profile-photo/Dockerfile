# ---- Build Stage ----
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install ALL dependencies (including devDependencies for build)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

# Copy only what's needed for production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built frontend from build stage
COPY --from=build /app/dist ./dist

# Copy server
COPY server.js ./

# Copy public assets (logos etc.)
COPY public ./public

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "server.js"]
