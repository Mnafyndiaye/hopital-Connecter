const express = require('express');
const router = express.Router();
const {Patient} = require('../models');
const bcrypt = require('bcrypt');
const authenticatePatient = require('../middlewares/authenticatePatient');
const { MedicalRecord, Consultation, Prescription, SignesVitaux, Assistant } = require('../models');


// GET all patients
router.get('/', async (req, res) => {
  const patients = await Patient.findAll();
  res.json(patients);
});

// POST create new patient
router.post('/', async (req, res) => {
  try {
    
    const { firstName, lastName, dateOfBirth, gender, phoneNumber, email, address, bloodType, password } = req.body;
    
    const newPatient = await Patient.create({ firstName, lastName, dateOfBirth, gender, phoneNumber, email, address, bloodType, password, assistantId: req.body.assistantId });
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
