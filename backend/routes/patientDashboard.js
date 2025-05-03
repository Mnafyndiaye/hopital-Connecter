const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const authenticatePatient = require('../middlewares/authenticatePatient');

// 👤 Récupérer les infos du patient connecté
router.get('/me', authenticatePatient, async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.patient.id, {
      attributes: { exclude: ['password'] } // Ne pas exposer le mot de passe
    });

    if (!patient) return res.status(404).json({ error: 'Patient introuvable' });

    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
