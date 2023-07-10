const knex = require('knex');

const config = {
    client: 'mysql',
    connection: {
      host: process.env.HOST_BD,
      user: process.env.USER_BD,
      password: process.env.PASSWORD_BD,
      database: 'public',
    },
  };
  
console.log(config);

const db = knex(config);

module.exports = db;
