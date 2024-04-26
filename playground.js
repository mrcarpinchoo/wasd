const bcrypt = require('bcryptjs');

const hash = bcrypt.hashSync('my password', 10);

console.log(hash);

const psw1 = 'my password';
const psw2 = 'my password2';

console.log(bcrypt.compareSync(psw1, hash));
console.log(bcrypt.compareSync(psw2, hash));
