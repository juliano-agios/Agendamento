const knex = require('knex');

const config = {
    client: 'mysql',
    connection: {
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: 'public',
    },
  };
  
console.log(config);

const db = knex(config);

module.exports = db;
