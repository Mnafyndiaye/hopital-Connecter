const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Assistant = require('../models/Assistant'); // ✅ Ajout
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');

// ✅ Créer un utilisateur (seulement admin)
router.post('/register', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, role });
    res.status(201).json({
      message: 'Utilisateur créé',
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Connexion (login)
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const normalizedRole = role.toLowerCase();

    const user = await User.findOne({
      where: {
        username,
        role: normalizedRole
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur ou rôle invalide' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'defaultSecret',
      { expiresIn: '1d' }
    );

    // 🔁 Ajout de assistantId si role = assistant
    if (user.role === 'assistant') {
      const assistant = await Assistant.findOne({ where: { userId: user.id } });
      if (!assistant) {
        return res.status(404).json({ message: "Profil assistant introuvable" });
      }

      return res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          assistantId: assistant.id
        }
      });
    }

    // Pour les autres rôles
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
