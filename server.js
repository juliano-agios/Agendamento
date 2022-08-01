require('dotenv').config()

// Importa o módulo do Express Framework
const express = require('express')
const { JsonWebTokenError } = require('jsonwebtoken')
// Inicializa um objeto de aplicação Express
const app = express()
const secRouter = require('./secRouter')

const knex = require ('knex') ({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
})

const port = process.env.PORT || 3000;

const lista_produtos = {
  produtos: [
      { id: 1, descricao: "Arroz parboilizado 5Kg", valor: 25.00, marca: "Tio João"  },
      { id: 2, descricao: "Maionese 250gr", valor: 7.20, marca: "Helmans"  },
      { id: 3, descricao: "Iogurte Natural 200ml", valor: 2.50, marca: "Itambé"  },
      { id: 4, descricao: "Batata Maior Palha 300gr", valor: 15.20, marca: "Chipps"  },
      { id: 5, descricao: "Nescau 400gr", valor: 8.00, marca: "Nestlé"  },
  ]
}

app.use (express.json ())
app.use(express.urlencoded({ extended: true }));


  // realiza log da requisição
app.use('*', function(req, res, next) {
  //console.log(new Date().toLocaleString(), req.method, req.url, req.query, req.path)
  console.log("req.method:", req.method)
  console.log("req.url:", req.url)
  console.log("req.query:", req.query)
  console.log("req.path:", req.path)
  console.log("req.body.dados:", req.body.dados)  
  next ()
})

// Cria um manipulador da rota padrão 
app.get('/', function (req, res) {
    res.send('CRUD HTTP - Juliano Cezar Caetano')    

})


//Alterar um produto
app.put('/produtos/:id', function (req, res) {
  let id = Number.parseInt(req.params.id)
  let idx = lista_produtos.produtos.findIndex(elem => elem.id == id)
  if (idx > -1) {
    produtoAux = lista_produtos.produtos[idx];
    
    if (req.body.descricao != null) {
      produtoAux.descricao = req.body.descricao;
    } 
    
    if (req.body.valor != null ) {
      produtoAux.valor = req.body.valor;
    }
    
    if (req.body.marca != null ) {
      produtoAux.marca = req.body.marca;
    }
    
    lista_produtos.produtos[idx] = produtoAux;
    
    res.status (200).json ( { messsage: "Produto/ID alterado com sucesso." })
    
  } else {
    res.status (404).json ( { messsage: "Esse Produto/ID não existe." })
  }
})


//Excluir um produto
app.delete('/produtos/:id', function (req, res) {
  let id = Number.parseInt(req.params.id)
  let idx = lista_produtos.produtos.findIndex(elem => elem.id == id)
  if (idx > -1) {
    lista_produtos.produtos.splice(idx,idx)
    res.status (200).json ( { messsage: "Produto/ID excluído com sucesso." })
  } else {
    res.status (404).json ( { messsage: "Esse Produto/ID não existe." })
  }
})

const checkToken = (req, res, next ) => {
  let authHeader = req.get('Authorization')
  console.log(authHeader)
  if (!authHeader) {
    
    res.status(403).json({message: 'Token não informado.'})
  } else {
    let  token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken ) => {
      if (err) {
        res.status(401).json ({ message: "Token expirou"})
        res.end()
      } else {
        req.token = decodedToken
        req.userId = decodedToken.id
        next ()
      }
    })
    req.role = token
    next()
  }
} 

const isAdmin = (req, res, next ) => {
  knex
  .select ('*').from ('usuario').where({ id: req.userId })
  .then ((usuarios) => {
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

//Listar a lista de produtos
app.get('/produtos', checkToken, function (req, res) {
  knex
    .select('*')
    .from('produto')
    .then(produto => res.json(produto))
   //res.json(lista_produtos)
})

//Listar um produto por ID
app.get('/produtos/:id', checkToken, function (req, res) {
  let id = Number.parseInt(req.params.id)

  knex
  .select('*')
  .from('produto')
  .where ({ id: id})
  .then(produtos => { 
      if (produtos.length) {
        let produto = produtos[0]
        res.status(200).json(produto)
        res.end()
      } else {
        res.status (403).json ({ message:  "Produto inexistente."}) 
      }
  })
})

//Incluir um produto
app.post('/produtos/', checkToken, isAdmin, function (req, res) {   
    knex('produto')
    .insert({
      descricao: req.body.descricao,
      valor: req.body.valor,
      marca: req.body.marca},
      ['id', 'descricao', 'valor', 'marca'])
    .then (produtos => {
      let produto = produtos[0]
      res.json ({ produto })
    })
    .catch (err => res.status(500).json ({ message: 'Erro ao inserir produto: ${err.message}'}))


})

// Inicializa o servidor HTTP na porta 3000
app.listen(port, function () {
    console.log('Servidor rodando na porta 3000')
})


