const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');

const User = require('../models/User');
const Assistant = require('../models/Assistant');

// POST /api/assistants — réservé à l'admin
router.post('/', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const {
      username, password,
      nom, prenom, telephone, email, adresse
    } = req.body;

    // Créer le compte utilisateur
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, role: 'assistant' });

    // Créer le profil assistant lié
    const assistant = await Assistant.create({
      nom,
      prenom,
      telephone,
      email,
      adresse,
      userId: user.id
    });

    res.status(201).json({ message: 'Assistant médical créé avec succès', assistant });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/assistants — admin uniquement
router.get('/', authenticate, authorizeRole('admin'), async (req, res) => {
  const assistants = await Assistant.findAll({ include: ['User'] });
  res.json(assistants);
});

module.exports = router;
