require('dotenv').config(); // 🔥 Charge les variables d’environnement

const bcrypt = require('bcrypt');
const sequelize = require('./config/database');
const User = require('./models/User');

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const existingAdmin = await User.findOne({ where: { username: 'admin' } });
    if (existingAdmin) {
      console.log('⚠️  Un administrateur existe déjà.');
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash('adminpass', 10);
    console.log('Hash généré pour adminpass:', hashedPassword);
    await User.create(
        {
          username: 'admin',
          password: hashedPassword,
          role: 'admin',
        },
        {
          individualHooks: false // <<=== désactive le hook beforeCreate
        }
      );
      
    console.log('Hash inséré en base :', hashedPassword);

    console.log('✅ Compte administrateur créé :');
    console.log('   ➤ Nom d’utilisateur : admin');
    console.log('   ➤ Mot de passe : adminpass');
  } catch (error) {
    console.error('❌ Erreur lors de la création de l’admin :', error);
  } finally {
    await sequelize.close();
    process.exit();
  }
})();
