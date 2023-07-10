const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const db = require('../Config/Database.js');

router.get('/', async (req, res) => {
  console.log("/usuario");
  console.log(req.query);

  const { id, email } = req.query;

  let query = db.select('*').from('usuario');

  if (id) {
    query = query.where('id', id);
  }

  if (email) {
    query = query.where('email', email);
  }

  query
    .then(usuarios => {console.log(usuarios); res.json(usuarios)})
    .catch(err => res.status(500).json({ message: `Erro ao buscar usuarios: ${err.message}` }));
});




router.post ('/login', express.json(), (req,res) => {
  let email = req.body.email
  let pass = req.body.password
  db
  .select ('*')
  .from ('usuario')
  .where ({ email: email })
  .then (usuarios => {
      if (usuarios.length > 0) {
          let usuario = usuarios[0]
          let checkSenha = bcrypt.compareSync (pass, usuario.senha)
          console.log("checkSenha:"+checkSenha)
          if (checkSenha) {
              res.status(201).json ({
                  id: usuario.id,
                  email: usuario.email,
                  roles: usuario.roles,
                  telefone: usuario.telefone,
                  nome: usuario.nome
              })                 
              res.end;              
          } else {    
            res.statusCode = 200;
              res.status (200).json ({ id: usuario.idusuario});   
              res.end()
          }
      } else {          
          res.status (401).json ({ message: "Usuario ou senha inválidos 01"})
          res.end()
      }
  })
  .catch(err => res.status(500).json({ message: "Usuario ou senha inválidos 02" }))
})
 

   
router.post('/', express.json(), (req,res) => {
  console.log(req.body);
  
  db
  .select ('*')
  .from ('usuario')
  .where ({ email: req.body.email })
  .then (usuarios => {
      if (usuarios.length > 0) {
          res.status (401).json ({ message: "Usuario ja existe"})         
      } else {
        db('usuario')
        .insert({          
          email: req.body.email,   
          nome:  req.body.nome,
          senha: bcrypt.hashSync(req.body.senha, 8),
          roles: req.body.roles,
          telefone: req.body.telefone
          },
          ['email', 'nome', 'senha', 'roles', 'telefone'])
        .then(  res.status (200).json ({ message: "Usuário incluído com sucesso." }))
        .catch ( res.status(401).json ({ message: 'Erro ao inserir usuário.'}))        
      } 
  })
})

module.exports = router;

