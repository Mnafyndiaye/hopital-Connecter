module.exports = (sequelize, DataTypes) => {
    const MedicalRecord = sequelize.define('MedicalRecord', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false // Exemple : "analyse", "imagerie", "diagnostic", "résultat labo"
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      doctorName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      attachmentUrl: {
        type: DataTypes.STRING,
        allowNull: true // pour fichiers locaux : PDF, image, scan, etc.
      },
      orthancId: {
        type: DataTypes.STRING,
        allowNull: true // identifiant DICOM pour récupérer l’image sur Orthanc
      }
    });
  
    MedicalRecord.associate = (models) => {
      MedicalRecord.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        as: 'patient',
        onDelete: 'CASCADE'
      });
  
      // Facultatif : lier à une consultation précise si applicable
      MedicalRecord.belongsTo(models.Consultation, {
        foreignKey: 'consultationId',
        as: 'consultation',
        allowNull: true,
        onDelete: 'SET NULL'
      });
    };
  
    return MedicalRecord;
  };
  