const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Patient, User, PatientMedecin } = require('../models');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');

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
