const express = require('express');
const router = express.Router();
const {Patient} = require('../models');
const authenticatePatient = require('../middlewares/authenticatePatient');
const { MedicalRecord, Consultation, Prescription, SignesVitaux, Assistant } = require('../models');

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

router.get('/medical-records', authenticatePatient, async (req, res) => {
    try {
      const patientId = req.patient.id;
  
      const consultations = await Consultation.findAll({
        where: { patientId },
        include: [
          { model: Prescription, as: 'prescriptions' },
          { model: SignesVitaux, as: 'signesVitaux' }
        ]
      });
  
      const medicalRecords = await MedicalRecord.findAll({
        where: { patientId }
      });
  
      res.json({ consultations, medicalRecords });
    } catch (err) {
      console.error("Erreur dans /medical-records :", err);
      res.status(500).json({ error: 'Erreur lors de la récupération du dossier médical' });
    }
  });
  
module.exports = router;
