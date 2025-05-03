const bcrypt = require('bcrypt');

const plain = 'adminpass';
const hash = '$2b$10$htJn6z23MRT.vgxazPDEL.aO5wtwwYNu03MIyEqRw8gmtkrLWdzgC'; // ← copie depuis ta base

bcrypt.compare(plain, hash).then(result => {
  console.log('Résultat test direct :', result);
});
