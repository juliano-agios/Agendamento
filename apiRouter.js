const express = require('express')
const knex = require('knex');

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const 
apiRouter = express.Router()

const config = {
  client: 'mysql',
  connection: {
    host: 'database-agendamento.cjd9bny9v473.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Linx3763',
    database: 'public',
  },
};

const db = knex(config);

/*
const knex = require ('knex') ({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  })
*/
// realiza log da requisição
apiRouter.use('*', function(req, res, next) {
  console.log("req.method:", req.method)
  console.log("req.url:", req.url)
  console.log("req.query:", req.query)
  console.log("req.path:", req.path)
  console.log("req.body:", req.body)  
  next ()
})  

  //Listar a lista de usuario
apiRouter.get('/usuarios',function (req, res) {
    db
      .select('*')
      .from('usuario')
      .then(usuario => res.json(usuario))
})

apiRouter.post ('/login', express.json(), (req,res) => {
  let user = req.body.login
  let pass = req.body.senha
  db
      .select ('*')
      .from ('usuario')
      .where ({ login: user})
      .then ((usuarios) => {
          if (usuarios.length) {
              let usuario = usuarios[0]
              let checkSenha = bcrypt.compareSync (pass, usuario.senha)
              if (checkSenha) {
                  let token = jwt.sign ( { id: usuario.idusuario}, 
                                          process.env.SECRET_KEY, 
                                          {expiresIn: 30})                   

                  res.set('Authorization', token);
                  res.status(201).json ({
                      id: usuario.idusuario,
                      login: usuario.login,
                      email: usuario.email,
                      roles: usuario.roles,
                      token: token
                  })                 
                  res.end;              
              } else {    
                res.statusCode = 200;
                  res.status (200).json ({ id: usuario.idusuario, token: token});   
                  res.end()
              }
          } else {          
              res.status (401).json ({ message: "Usuario ou senha inválidos"})
              res.end()
          }
      })
  .catch(err => res.status(500).json({ message: "Usuario ou senha inválidos" }))
})
 

   
apiRouter.post('/register', express.json(), (req,res) => {
  db('usuario')
  .insert({
    nome:  req.body.nome,
    email: req.body.email,   
    login: req.body.login,
    senha: bcrypt.hashSync(req.body.senha, 8),
    roles: req.body.roles},
    ['nome', 'email', 'login', 'senha', 'roles'])
  .then(  res.status (200).json ( { message: "Usuário incluído com sucesso." }))
  .catch (err => res.status(500).json ({ message: 'Erro ao inserir usuário: ${err.message}'}))
})

const checkToken = (req, res, next ) => {
    //let authHeader = req.get('Authorization')
    let authHeader = req.headers['authorization'];
    if (!authHeader) {      
      res.status(403).json({message: 'Token não informado.'})
      res.end()
    } else {
      let  token = authHeader.split(' ')[0]
      jwt.verify(token, process.env.SECRET_KEY, (err, decodeToken ) => {
        if (err) {
          res.status(401).json ({ message: "Token expirou"})
          res.end()
        } else {
          req.userId = decodeToken.id
          next ()
        }
      })
    }
  } 

  const isAdmin = (req, res, next ) => {
    db
    .select ('*')
    .from ('usuario')
    .where({ id: req.userId })
    .then ((usuarios) => {
      console.log(usuarios.length);
        if (usuarios.length) {
            let usuario = usuarios[0]
            let roles = usuario.roles.split(';')
            let adminRole = roles.find(i => i === 'ADMIN')
            if (adminRole === 'ADMIN') {
                next()
            }
            else { 
                res.status(403).json({ message: 'Role de ADMIN requerida' })
            }
        }
    })
    .catch (err => {
        res.status(500).json({ 
          message: 'Erro ao verificar roles de usuário - ' + err.message })
    })
  }
    
  //Listar a lista de clientes
  apiRouter.get('/clientes', function (req, res) {
      db
        .select('*')
        .from('cliente')
        .then(cliente => res.json(cliente))
  })
    
  apiRouter.get('/clientes/:cpf', checkToken, isAdmin, function (req, res) {
    let cpf = Number.parseInt(req.params.cpf)
  
    db
    .select('*')
    .from('cliente')
    .where ({ cpf: cpf})
    .then(clientes => { 
        if (clientes.length) {
          let cliente = clientes[0]
          res.status(200).json(cliente)
          res.end()
        } else {
          res.status (403).json ({ message:  "cliente inexistente."}) 
        }
    })
  })
  
  //Incluir um cliente
  apiRouter.post('/clientes/', checkToken, isAdmin, function (req, res) {   
    db('cliente')
    .insert({
      cpf: req.body.cpf,
      nome: req.body.nome,   
      email: req.body.email},
      ['cpf', 'nome', 'email'])
    .then(  res.status (200).json ( { message: "cliente incluído com sucesso." }))
    .catch (err => res.status(500).json ({ message: 'Erro ao inserir cliente: ${err.message}'}))
  })
  
  //Excluir um cliente
  apiRouter.delete('/clientes/:cpf', checkToken, isAdmin, function (req, res) {
    let cpf = Number.parseInt(req.params.cpf);
    if (cpf > 0) {
        db('cliente')
          .where('cpf', cpf)
          .del()
          .then(  res.status (200).json ( { message: "cliente excluído com sucesso." }))
    } else {
      res.status (404).json ( { message: "Esse cliente não existe." })
    }  
  })
    
  //Alterar um cliente
  apiRouter.put('/clientes/:cpf', checkToken, isAdmin, function (req, res) {  
    let cpf = Number.parseInt(req.params.cpf);
    if (cpf > 0) {
        db('cliente')
            .where('cpf', cpf)
            .update({
                nome: req.body.nome,
                email: req.body.email
            },
            ['cpf','nome','email'])
            .then (clientes => {
                let cliente = clientes[0]
                res.status (200).json ( { message: "cliente alterado com sucesso." })
            })
    } else {
      res.status (404).json ( { message: "Esse cliente não existe." })
    }  
  })
  
module.exports = apiRouter
