require('dotenv').config();

// Fichier .env pour les variables d'environnement
// MONGODB_URI=mongodb://localhost:27017/smart-home
// JWT_SECRET=smart-home-secret-key
// PORT=5000

// Créer le fichier .env dans le répertoire backend
module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-home',
  JWT_SECRET: process.env.JWT_SECRET || 'smart-home-secret-key',
  PORT: process.env.PORT || 5000
};
