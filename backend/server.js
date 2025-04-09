require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth');
const actionRoutes = require('./routes/actions');

// Initialisation de l'application
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/actions', actionRoutes);

// Route pour la page de connexion
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../login/login.html'));
});

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-home', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connexion à MongoDB établie');
  // Démarrer le serveur après la connexion à la base de données
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
})
.catch(err => {
  console.error('Erreur de connexion à MongoDB:', err);
});
