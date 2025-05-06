const express = require('express');
const router = express.Router();
const { RendezVous, Patient, Medecin } = require('../models');

// Créer une demande de rendez-vous (par patient)
router.post('/', async (req, res) => {
  try {
    const { date, motif, patientId, medecinId } = req.body;
    const rendezVous = await RendezVous.create({ date, motif, patientId, medecinId });
    res.status(201).json(rendezVous);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création du rendez-vous', details: err.message });
  }
});

// Obtenir tous les rendez-vous d'un médecin
router.get('/medecin/:id', async (req, res) => {
  try {
    const rendezVous = await RendezVous.findAll({
      where: { medecinId: req.params.id },
      include: ['patient']
    });
    res.json(rendezVous);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous' });
  }
});

// Obtenir tous les rendez-vous d'un patient
router.get('/patient/:id', async (req, res) => {
  try {
    const rendezVous = await RendezVous.findAll({
      where: { patientId: req.params.id },
      include: ['medecin']
    });
    res.json(rendezVous);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous' });
  }
});

// Modifier un rendez-vous (statut ou date)
router.put('/:id', async (req, res) => {
  try {
    const { date, statut } = req.body;
    const rendezVous = await RendezVous.findByPk(req.params.id);
    if (!rendezVous) return res.status(404).json({ error: 'Rendez-vous non trouvé' });

    if (date) rendezVous.date = date;
    if (statut) rendezVous.statut = statut;

    await rendezVous.save();

    // TODO: envoyer notification (email ou autre)
    res.json(rendezVous);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du rendez-vous' });
  }
});

module.exports = router;
