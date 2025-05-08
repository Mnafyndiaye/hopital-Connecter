module.exports = (sequelize, DataTypes) => {
    const RendezVous = sequelize.define('RendezVous', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      motif: {
        type: DataTypes.STRING,
        allowNull: false
      },
      statut: {
        type: DataTypes.ENUM('en attente','planifié', 'annulé', 'reprogrammé', 'terminé'),
        defaultValue: 'en attente',
      }
    });
  
    RendezVous.associate = (models) => {
      RendezVous.belongsTo(models.Patient, {
        foreignKey: 'patientId',
        as: 'patient',
        onDelete: 'CASCADE'
      });
      RendezVous.belongsTo(models.Medecin, {
        foreignKey: 'medecinId',
        as: 'medecin',
        onDelete: 'CASCADE'
      });
    };
  
    return RendezVous;
  };
  