module.exports = (sequelize, DataTypes) => {
    const Prescription = sequelize.define('Prescription', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      medication: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dosage: {
        type: DataTypes.STRING,
        allowNull: false
      },
      instructions: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    });
  
    Prescription.associate = (models) => {
      Prescription.belongsTo(models.Consultation, {
        foreignKey: 'consultationId',
        as: 'consultation',
        onDelete: 'CASCADE'
      });
    };
  
    return Prescription;
  };
  