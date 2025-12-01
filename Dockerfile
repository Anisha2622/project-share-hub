# ==============================================
# Stage 1: Build Stage (Vite + Node)
# ==============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Optional: Fix npm registry issues if running inside restricted Jenkins/K8s pods
RUN npm config set registry http://registry.npmjs.org/ \
    && npm config set strict-ssl false

# ---------------------------------------------------------------------------
# Build Arguments
# These are required because Vite "bakes" env vars into the HTML/JS at build time.
# Even though it's "Frontend Only", it needs these keys to talk to Supabase.
# ---------------------------------------------------------------------------
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set them as environment variables for the build process
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
# Using --legacy-peer-deps helps avoid dependency conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Build the Vite application (creates the /dist folder)
RUN npx vite build


# ==============================================
# Stage 2: Production Stage (Nginx)
# ==============================================
FROM nginx:alpine

# 1. Configure Nginx for Single Page Application (SPA)
# We remove the default config and write a new one that handles 
# client-side routing (redirecting 404s to index.html).
RUN rm /etc/nginx/conf.d/default.conf \
    && printf "server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files \$uri \$uri/ /index.html;\n\
    }\n\
}\n" > /etc/nginx/conf.d/default.conf

# 2. Copy the built static assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# 3. Expose port 80
EXPOSE 80

# 4. Run Nginx in foreground to prevent container exit
CMD ["nginx", "-g", "daemon off;"]