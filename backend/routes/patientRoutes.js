const express = require('express');
const router = express.Router();
const {Patient} = require('../models');
const bcrypt = require('bcrypt');
const authenticatePatient = require('../middlewares/authenticatePatient');
const Assistant = require('../models/Assistant'); // Ajout de l'importation du modèle Assistant 


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

module.exports = router;
