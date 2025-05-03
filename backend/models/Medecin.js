const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Medecin = sequelize.define('Medecin', {
  nom: { type: DataTypes.STRING, allowNull: false },
  prenom: { type: DataTypes.STRING, allowNull: false },
  specialite: { type: DataTypes.STRING, allowNull: false },
  numeroSS: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: true, validate: { isEmail: true } },
  telephone: { type: DataTypes.STRING, allowNull: false },
  adresse: { type: DataTypes.TEXT, allowNull: true },
});

// Lier à l'utilisateur
Medecin.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Medecin, { foreignKey: 'userId' });

module.exports = Medecin;
