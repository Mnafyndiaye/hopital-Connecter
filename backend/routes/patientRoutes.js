const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// GET all patients
router.get('/', async (req, res) => {
  const patients = await Patient.findAll();
  res.json(patients);
});

// POST create new patient
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, email } = req.body;
    const newPatient = await Patient.create({ firstName, lastName, dateOfBirth, gender, phoneNumber, email, address, bloodType, password });
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
