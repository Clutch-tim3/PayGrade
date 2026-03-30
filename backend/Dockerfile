FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Create .env file from example
RUN cp .env.example .env

# Expose port
EXPOSE 3000

# Run migrations and start server
CMD npm run prisma:generate && npm run prisma:migrate -- --name init && npm start