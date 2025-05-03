// routes/assignMedecin.js

const express = require('express');
const router = express.Router();
const { Patient, User, PatientMedecin } = require('../models');
const { authenticate, authorizeRole } = require('../middleware/auth');

// Seule l'assistant peut faire cette opération
router.post('/assign-medecin', authenticate, authorizeRole('assistant'), async (req, res) => {
  const { patientId, medecinId } = req.body;

  // Vérification des paramètres requis
  if (!patientId || !medecinId) {
    return res.status(400).json({ error: 'patientId et medecinId sont requis' });
  }

  try {
    // Vérifie que les deux entités existent
    const patient = await Patient.findByPk(patientId);
    const medecin = await User.findByPk(medecinId);

    if (!patient) {
      return res.status(404).json({ error: 'Patient non trouvé' });
    }
    if (!medecin || medecin.role !== 'medecin') {
      return res.status(400).json({ error: 'Médecin invalide' });
    }

    // Vérifie s'il existe déjà une association entre ce patient et ce médecin
    const existing = await PatientMedecin.findOne({
      where: { patientId, medecinId },
    });

    if (existing) {
      return res.status(409).json({ message: 'Ce médecin est déjà assigné à ce patient.' });
    }

    // Crée l'association entre le patient et le médecin
    await PatientMedecin.create({ patientId, medecinId });
    return res.status(201).json({ message: 'Médecin assigné au patient avec succès.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
