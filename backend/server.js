const app = require('./app');
const PORT = process.env.PORT || 5000;
const sequelize = require('./config/database');
const Patient = require('./models/Patient');
const Medecin = require('./models/Medecin');
const Assistant = require('./models/Assistant');
const User = require('./models/User');

sequelize.sync({ alter: true }) // alter: true pour développement, à remplacer plus tard
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

