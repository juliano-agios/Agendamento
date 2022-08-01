const express = require('express')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const secRouter = express.Router()

const knex = require ('knex') ({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  })

secRouter.post ('/login', (req,res) => {

    console.log("login")
    console.log("req.method:", req.method)
    console.log("req.url:", req.url)
    console.log("req.query:", req.query)
    console.log("req.path:", req.path)
    console.log("req.body:", req.body)  
    let user = req.body.login
    let pass = req.body.senha

    knex
        .select ('*')
        .from ('usuario')
        .where ({ login: user})
        .then ((usuarios) => {
            if (usuarios.length) {
                let usuario = usuarios[0]
                let checkSenha = bcrypt.compareSync (pass, usuario.senha)
                if (checkSenha) {
                    let token = jwt.sign ( { id: usuario.id}, 
                                            process.env.SECRET_KEY, 
                                            {expiresIn: 30})
                    res.status (200).json ({ id: usuario.id, token: token})
                    res.end()
                } else {                     
                    res.status (401).json ({ message: "Usuario ou senha inválidos"})
                    res.end()
                }
            } else {                     
                res.status (401).json ({ message: "Usuario ou senha inválidos"})
                res.end()
            }
        })
        .catch (err => res.status(500).json ({ message: 'Erro ao inserir produto: ${err.message}'}))
})

secRouter.post('/register', express.json(), (req,res) => {
    //inserir usuario no BD
})
module.exports = secRouter
