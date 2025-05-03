module.exports = (sequelize, DataTypes) => {
  const Medecin = sequelize.define('Medecin', {
    nom: { type: DataTypes.STRING, allowNull: false },
    prenom: { type: DataTypes.STRING, allowNull: false },
    specialite: { type: DataTypes.STRING, allowNull: false },
    numeroSS: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: true, validate: { isEmail: true } },
    telephone: { type: DataTypes.STRING, allowNull: false },
    adresse: { type: DataTypes.TEXT, allowNull: true },
  });

  Medecin.associate = (models) => {
    Medecin.belongsTo(models.User, { foreignKey: 'userId' });
    models.User.hasOne(Medecin, { foreignKey: 'userId' });
  };

  return Medecin;
};
