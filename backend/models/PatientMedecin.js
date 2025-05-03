// models/patientMedecin.js

module.exports = (sequelize, DataTypes) => {
    const PatientMedecin = sequelize.define('PatientMedecin', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      }
    });
  
    PatientMedecin.associate = (models) => {
      PatientMedecin.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        as: 'patient',
        onDelete: 'CASCADE'
      });
  
      PatientMedecin.belongsTo(models.User, {
        foreignKey: 'medecinId',
        as: 'medecin',
        onDelete: 'CASCADE'
      });
    };
  
    return PatientMedecin;
  };
  