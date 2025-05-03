// routes/medicalRecordRoutes.js

const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');
const { Patient, Consultation, Prescription, SignesVitaux, MedicalRecord } = require('../models');

// ✅ Voir le dossier médical complet d’un patient
router.get('/patient/:patientId', authenticate, authorizeRole('medecin'), async (req, res) => {
  try {
    const { patientId } = req.params;

    const consultations = await Consultation.findAll({
      where: { patientId },
      include: [Prescription, SignesVitaux]
    });

    const medicalRecords = await MedicalRecord.findAll({
      where: { patientId }
    });

    res.json({ consultations, medicalRecords });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du chargement du dossier médical.' });
  }
});

// ✅ Ajouter une consultation avec prescriptions et signes vitaux
router.post('/consultation', authenticate, authorizeRole('medecin'), async (req, res) => {
  try {
    const { patientId, notes, date, prescriptions, signesVitaux } = req.body;

    const consultation = await Consultation.create({
      patientId,
      medecinId: req.user.userId,
      notes,
      date
    });

    // Ajout des prescriptions
    if (prescriptions && prescriptions.length > 0) {
      for (const p of prescriptions) {
        await Prescription.create({
          consultationId: consultation.id,
          medication: p.medication,
          dosage: p.dosage,
          frequency: p.frequency,
          duration: p.duration
        });
      }
    }

    // Ajout des signes vitaux
    if (signesVitaux) {
      await SignesVitaux.create({
        consultationId: consultation.id,
        temperature: signesVitaux.temperature,
        bloodPressure: signesVitaux.bloodPressure,
        heartRate: signesVitaux.heartRate,
        respiratoryRate: signesVitaux.respiratoryRate
      });
    }

    res.status(201).json({ message: 'Consultation enregistrée avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Erreur lors de l’enregistrement de la consultation.' });
  }
});

// ✅ Ajouter un enregistrement médical libre (radio, analyse, DICOM, etc.)
router.post('/medical-record', authenticate, authorizeRole('medecin'), async (req, res) => {
  try {
    const { patientId, type, description, date, doctorName, attachmentUrl, orthancId } = req.body;

    const record = await MedicalRecord.create({
      patientId,
      type,
      description,
      date,
      doctorName,
      attachmentUrl,
      orthancId
    });

    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Erreur lors de l’enregistrement du document médical.' });
  }
});

module.exports = router;
