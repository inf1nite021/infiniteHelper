FROM node:20-alpine
# tzdata, damit TZ=Europe/Berlin auch fuer die Systemzeit gilt: Ohne das
# rechnet zwar Nodes Intl richtig, Logzeitstempel und `date` stuenden aber
# weiter auf UTC - zwei Zeiten im selben Container laden zu Fehlern ein.
RUN apk add --no-cache openssl tzdata

WORKDIR /app

COPY package.json package-lock.json* ./

# Volle Installation inkl. devDependencies — react-router build braucht vite,
# das in devDependencies liegt. NODE_ENV wird erst nach dem Build gesetzt.
RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "docker-start"]
