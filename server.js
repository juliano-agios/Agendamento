require('dotenv').config()


const express = require('express')
const app = express()
const { JsonWebTokenError } = require('jsonwebtoken')
const apiRouter = require('./apiRouter')
const port = process.env.PORT || 3000;

const knex = require ('knex') ({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
})

app.use(express.json ())
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRouter);
app.use('/site', express.static('public'));

// Inicializa o servidor HTTP na porta 3000
app.listen(port, function () {
    console.log('Servidor rodando na porta 3000')
})


