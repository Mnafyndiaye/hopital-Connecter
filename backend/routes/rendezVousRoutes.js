const express = require('express');
const router = express.Router();
const { RendezVous, Patient, Medecin } = require('../models');

// ────────────── 📌 PATIENT ──────────────

// Créer une demande de rendez-vous (Patient)
router.post('/', async (req, res) => {
  try {
    const { date, motif, patientId, medecinId } = req.body;
    const rendezVous = await RendezVous.create({
      date,
      motif,
      patientId,
      medecinId,
      statut: 'en attente',
    });
    res.status(201).json(rendezVous);
  } catch (err) {
    res.status(500).json({ error: 'Erreur création rendez-vous', details: err.message });
  }
});

// Voir les rendez-vous d’un patient
router.get('/patient/:id', async (req, res) => {
  try {
    const rendezVous = await RendezVous.findAll({
      where: { patientId: req.params.id },
      include: [
        { model: Medecin, as: 'medecin', attributes: ['id', 'prenom', 'nom'] }
      ],
      order: [['date', 'DESC']],
    });
    res.json(rendezVous);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération rendez-vous du patient' });
  }
});

// ────────────── 📌 MEDECIN ──────────────

// Voir les rendez-vous d’un médecin
router.get('/medecin/:id', async (req, res) => {
  try {
    const { statut } = req.query;
    const whereClause = { medecinId: req.params.id };
    if (statut) whereClause.statut = statut;

    const rendezVous = await RendezVous.findAll({
      where: whereClause,
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'firstName', 'lastName'] }
      ],
      order: [['date', 'DESC']],
    });
    res.json(rendezVous);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération rendez-vous du médecin' });
  }
});

// Mettre à jour le statut (terminé ou annulé) par le médecin
router.put('/:id/statut', async (req, res) => {
  try {
    const { statut } = req.body;
    const rendezVous = await RendezVous.findByPk(req.params.id);

    if (!rendezVous) {
      return res.status(404).json({ error: 'Rendez-vous non trouvé' });
    }

    if (!['terminé', 'annulé'].includes(statut)) {
      return res.status(400).json({ error: 'Statut invalide pour le médecin' });
    }

    rendezVous.statut = statut;
    await rendezVous.save();

    res.json({ message: 'Statut mis à jour', rendezVous });
  } catch (err) {
    res.status(500).json({ error: 'Erreur mise à jour statut' });
  }
});

// ────────────── 📌 ASSISTANT ──────────────

// Voir les rendez-vous en attente
router.get('/pending', async (req, res) => {
  try {
    const rendezVous = await RendezVous.findAll({
      where: { statut: 'en attente' },
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'firstName', 'lastName'] },
        { model: Medecin, as: 'medecin', attributes: ['id', 'prenom', 'nom'] }
      ],
      order: [['date', 'ASC']],
    });
    res.json(rendezVous);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération rendez-vous en attente' });
  }
});

// Planifier un rendez-vous (changer statut uniquement)
router.put('/:id/planifier', async (req, res) => {
  try {
    const rendezVous = await RendezVous.findByPk(req.params.id);
    if (!rendezVous) {
      return res.status(404).json({ error: 'Rendez-vous non trouvé' });
    }

    rendezVous.statut = 'planifié';
    await rendezVous.save();

    res.json({ message: 'Rendez-vous planifié', rendezVous });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la planification' });
  }
});

// Reprogrammer un rendez-vous (changer date, heure ou médecin)
router.put('/:id/reprogrammer', async (req, res) => {
  try {
    const { date, medecinId } = req.body;
    const rendezVous = await RendezVous.findByPk(req.params.id);

    if (!rendezVous) {
      return res.status(404).json({ error: 'Rendez-vous non trouvé' });
    }

    if (date) rendezVous.date = new Date(date);
    if (medecinId) rendezVous.medecinId = medecinId;

    rendezVous.statut = 'reprogrammé';
    await rendezVous.save();

    res.json({ message: 'Rendez-vous reprogrammé', rendezVous });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la reprogrammation', details: err.message });
  }
});

module.exports = router;
