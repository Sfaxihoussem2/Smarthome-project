const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Action = require('../models/Action');
const User = require('../models/User');

// Configuration du secret JWT
const JWT_SECRET = process.env.JWT_SECRET || 'smart-home-secret-key';

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

// Route pour enregistrer une action
router.post('/log', verifyToken, async (req, res) => {
  try {
    const { actionType, deviceName, deviceState, room, details } = req.body;
    
    const newAction = new Action({
      userId: req.user.id,
      username: req.user.username,
      actionType,
      deviceName,
      deviceState,
      room,
      details
    });
    
    await newAction.save();
    
    res.status(201).json({
      success: true,
      message: 'Action enregistrée avec succès',
      action: newAction
    });
  } catch (error) {
    console.error('Erreur d\'enregistrement d\'action:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement de l\'action'
    });
  }
});

// Route pour récupérer l'historique des actions d'un utilisateur
router.get('/history', verifyToken, async (req, res) => {
  try {
    const { limit = 50, skip = 0, actionType, deviceName, room } = req.query;
    
    // Construire le filtre de recherche
    const filter = { userId: req.user.id };
    
    if (actionType) filter.actionType = actionType;
    if (deviceName) filter.deviceName = deviceName;
    if (room) filter.room = room;
    
    // Récupérer les actions avec pagination
    const actions = await Action.find(filter)
      .sort({ timestamp: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    
    // Compter le nombre total d'actions correspondant au filtre
    const total = await Action.countDocuments(filter);
    
    res.json({
      success: true,
      actions,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > (parseInt(skip) + parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Erreur de récupération de l\'historique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'historique des actions'
    });
  }
});

// Route pour récupérer les statistiques des actions
router.get('/stats', verifyToken, async (req, res) => {
  try {
    // Statistiques par type d'action
    const actionTypeStats = await Action.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$actionType', count: { $sum: 1 } } }
    ]);
    
    // Statistiques par pièce
    const roomStats = await Action.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$room', count: { $sum: 1 } } }
    ]);
    
    // Statistiques par dispositif
    const deviceStats = await Action.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$deviceName', count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      stats: {
        byActionType: actionTypeStats,
        byRoom: roomStats,
        byDevice: deviceStats
      }
    });
  } catch (error) {
    console.error('Erreur de récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

// Route pour supprimer une action
router.delete('/:actionId', verifyToken, async (req, res) => {
  try {
    const action = await Action.findById(req.params.actionId);
    
    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Action non trouvée'
      });
    }
    
    // Vérifier que l'action appartient à l'utilisateur
    if (action.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé à cette action'
      });
    }
    
    await action.remove();
    
    res.json({
      success: true,
      message: 'Action supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur de suppression d\'action:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'action'
    });
  }
});

module.exports = router;
