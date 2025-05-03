module.exports = (sequelize, DataTypes) => {
    const Consultation = sequelize.define('Consultation', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    });
  
    Consultation.associate = (models) => {
      Consultation.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        as: 'patient',
        onDelete: 'CASCADE'
      });
      Consultation.belongsTo(models.Medecin, {
        foreignKey: 'doctorId',
        as: 'doctor',
        onDelete: 'SET NULL'
      });
      Consultation.hasMany(models.Prescription, {
        foreignKey: 'consultationId',
        as: 'prescriptions'
      });
      Consultation.hasOne(models.SignesVitaux, {
        foreignKey: 'consultationId',
        as: 'signesVitaux'
      });
    };
  
    return Consultation;
};
  