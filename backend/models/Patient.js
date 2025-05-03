const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const Patient = sequelize.define('Patient', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('homme', 'femme'),
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  bloodType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assistantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Assistants',
      key: 'id'
    }
  },
});

Patient.associate = (models) => {
    Patient.belongsTo(models.Assistant, {
      foreignKey: 'assistantId',
      as: 'assistant',
    });
  };
  

// Hash du mot de passe avant la création
Patient.beforeCreate(async (patient, options) => {
  if (!patient.password.startsWith('$2b$')) {
    const salt = await bcrypt.genSalt(10);
    patient.password = await bcrypt.hash(patient.password, salt);
  }
});
module.exports = Patient;
