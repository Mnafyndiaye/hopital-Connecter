module.exports = (sequelize, DataTypes) => {
  const Assistant = sequelize.define('Assistant', {
    nom: { type: DataTypes.STRING, allowNull: false },
    prenom: { type: DataTypes.STRING, allowNull: false },
    telephone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true, validate: { isEmail: true } },
    adresse: { type: DataTypes.TEXT, allowNull: true },
  });

  Assistant.associate = (models) => {
    Assistant.belongsTo(models.User, { foreignKey: 'userId' });
    models.User.hasOne(Assistant, { foreignKey: 'userId' });

    Assistant.hasMany(models.Patient, {
      foreignKey: 'assistantId',
      as: 'patients',
    });
  };

  return Assistant;
};
