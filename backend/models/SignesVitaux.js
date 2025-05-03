module.exports = (sequelize, DataTypes) => {
    const SignesVitaux = sequelize.define('SignesVitaux', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      temperature: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      tension: {
        type: DataTypes.STRING,
        allowNull: true
      },
      poids: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      frequenceCardiaque: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    });
  
    SignesVitaux.associate = (models) => {
      SignesVitaux.belongsTo(models.Consultation, {
        foreignKey: 'consultationId',
        as: 'consultation',
        onDelete: 'CASCADE'
      });
    };
  
    return SignesVitaux;
  };
  