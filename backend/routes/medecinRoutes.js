const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Medecin = require('../models/Medecin');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');
const bcrypt = require('bcrypt');

// Créer un médecin (admin uniquement)
router.post('/', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const {
      username, password,
      nom, prenom, specialite, numeroSS, email, telephone, adresse
    } = req.body;

    // 1. Créer le compte utilisateur
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, role: 'medecin' });

    // 2. Créer les infos du médecin liées à ce compte
    const medecin = await Medecin.create({
      nom,
      prenom,
      specialite,
      numeroSS,
      email,
      telephone,
      adresse,
      userId: user.id
    });

    res.status(201).json({ message: 'Médecin créé avec succès', medecin });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/medecins — admin et assistant uniquement
router.get('/', authenticate, authorizeRole('admin', 'assistant'), async (req, res) => {
  const medecins = await Medecin.findAll({ include: ['User'] });
  res.json(medecins);
});
  
module.exports = router;
