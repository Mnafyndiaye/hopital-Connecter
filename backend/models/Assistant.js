const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Assistant = sequelize.define('Assistant', {
  nom: { type: DataTypes.STRING, allowNull: false },
  prenom: { type: DataTypes.STRING, allowNull: false },
  telephone: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: true, validate: { isEmail: true } },
  adresse: { type: DataTypes.TEXT, allowNull: true },
});

// Liaison avec le User
Assistant.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Assistant, { foreignKey: 'userId' });

module.exports = Assistant;
