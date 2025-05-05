const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');
const { Patient, Consultation, Prescription, SignesVitaux, MedicalRecord } = require('../models');

// ✅ Voir le dossier médical complet d’un patient
router.get('/patient/:patientId', authenticate, authorizeRole('medecin'), async (req, res) => {
    try {
      const { patientId } = req.params;
  
      // Récupérer les infos personnelles du patient
      const patient = await Patient.findByPk(patientId, {
        attributes: ['id', 'firstName', 'lastName', 'gender', 'dateOfBirth', 'bloodType']
      });
  
      if (!patient) {
        return res.status(404).json({ error: 'Patient non trouvé.' });
      }
  
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
  
      // On retourne maintenant les infos personnelles aussi
      res.json({ 
        patient, 
        consultations, 
        medicalRecords 
      });
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
          instructions: p.instructions,
        });
      }
    }

    // Ajout des signes vitaux
    if (signesVitaux) {
      await SignesVitaux.create({
        consultationId: consultation.id,
        temperature: signesVitaux.temperature,
        tension: signesVitaux.tension,
        poids: signesVitaux.poids,
        frequenceCardiaque: signesVitaux.frequenceCardiaque
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

// 🔄 Modifier une consultation (notes et date uniquement)
router.put('/consultation/:id', authenticate, authorizeRole('medecin'), async (req, res) => {
    try {
      const { id } = req.params;
      const { notes, date } = req.body;
  
      const consultation = await Consultation.findByPk(id);
      if (!consultation) {
        return res.status(404).json({ error: 'Consultation non trouvée' });
      }
  
      consultation.notes = notes ?? consultation.notes;
      consultation.date = date ?? consultation.date;
      await consultation.save();
  
      res.json({ message: 'Consultation mise à jour avec succès.' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Erreur lors de la mise à jour.' });
    }
  });
  
  // ❌ Supprimer une consultation
  router.delete('/consultation/:id', authenticate, authorizeRole('medecin'), async (req, res) => {
    try {
      const { id } = req.params;
  
      const consultation = await Consultation.findByPk(id);
      if (!consultation) {
        return res.status(404).json({ error: 'Consultation non trouvée' });
      }
  
      await consultation.destroy();
      res.json({ message: 'Consultation supprimée.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur lors de la suppression.' });
    }
  });
  
  // 🔄 Modifier un enregistrement médical
  router.put('/medical-record/:id', authenticate, authorizeRole('medecin'), async (req, res) => {
    try {
      const { id } = req.params;
      const { type, description, date, doctorName, attachmentUrl, orthancId } = req.body;
  
      const record = await MedicalRecord.findByPk(id);
      if (!record) {
        return res.status(404).json({ error: 'Enregistrement non trouvé' });
      }
  
      Object.assign(record, {
        type: type ?? record.type,
        description: description ?? record.description,
        date: date ?? record.date,
        doctorName: doctorName ?? record.doctorName,
        attachmentUrl: attachmentUrl ?? record.attachmentUrl,
        orthancId: orthancId ?? record.orthancId
      });
  
      await record.save();
      res.json({ message: 'Enregistrement mis à jour.' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Erreur lors de la mise à jour.' });
    }
  });
  
  // ❌ Supprimer un enregistrement médical
  router.delete('/medical-record/:id', authenticate, authorizeRole('medecin'), async (req, res) => {
    try {
      const { id } = req.params;
  
      const record = await MedicalRecord.findByPk(id);
      if (!record) {
        return res.status(404).json({ error: 'Enregistrement non trouvé' });
      }
  
      await record.destroy();
      res.json({ message: 'Enregistrement supprimé.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur lors de la suppression.' });
    }
  });
  
module.exports = router;
