const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Configuration du secret JWT
const JWT_SECRET = process.env.JWT_SECRET || 'smart-home-secret-key';

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cet utilisateur ou cette adresse email existe déjà' 
      });
    }

    // Créer un nouvel utilisateur
    const newUser = new User({
      username,
      email,
      password
    });

    // Sauvegarder l'utilisateur dans la base de données
    await newUser.save();

    // Générer un token JWT
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      token
    });
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Rechercher l'utilisateur
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe incorrect'
      });
    }

    // Mettre à jour la date de dernière connexion
    user.lastLogin = Date.now();
    await user.save();

    // Générer un token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: req.body.remember ? '7d' : '1d' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      token
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
});

// Route de réinitialisation de mot de passe
router.post('/reset-password', async (req, res) => {
  try {
    const { username } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Dans une application réelle, envoyez un email avec un lien de réinitialisation
    // Pour cette démo, nous simulons simplement une réponse réussie
    res.json({
      success: true,
      message: 'Instructions de réinitialisation envoyées à l\'adresse email associée'
    });
  } catch (error) {
    console.error('Erreur de réinitialisation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réinitialisation du mot de passe'
    });
  }
});

// Middleware de vérification du token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé, token manquant'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré'
    });
  }
};

// Route protégée pour vérifier l'authentification
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Erreur de récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
});

module.exports = router;
