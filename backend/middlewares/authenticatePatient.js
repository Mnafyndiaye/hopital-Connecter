const jwt = require('jsonwebtoken');

function authenticatePatient(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token manquant' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret');
    req.patient = { id: payload.patientId }; // 💡 Stocké dans req.patient
    next();
  } catch {
    res.status(403).json({ error: 'Token invalide' });
  }
}

module.exports = authenticatePatient;
