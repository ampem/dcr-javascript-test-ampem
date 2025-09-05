FROM node:20-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package.json to install dependencies
COPY package.json .

RUN npm install -g npm@latest

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

CMD ["npm", "test"]
