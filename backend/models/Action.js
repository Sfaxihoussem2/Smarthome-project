const mongoose = require('mongoose');

const ActionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  actionType: {
    type: String,
    required: true,
    enum: ['login', 'logout', 'switch', 'temperature', 'other']
  },
  deviceName: {
    type: String
  },
  deviceState: {
    type: String
  },
  room: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: {
    type: Object
  }
});

module.exports = mongoose.model('Action', ActionSchema);
