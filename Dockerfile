# Utiliser une image légère de Node.js
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json depuis my-app/
COPY my-app/package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le projet `my-app` dans le conteneur
COPY my-app ./

# Construire l'application React
RUN npm run build

# Installer un serveur HTTP léger
RUN npm install -g serve

# Exposer le port
EXPOSE 3000

# Lancer l'application
CMD ["serve", "-s", "build", "-l", "3000"]