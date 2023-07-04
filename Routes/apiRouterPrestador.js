const express = require('express');
const router = express.Router();
const db = require('../Config/Database.js');

router.get('/', async (req, res) => {
    db
    .select('*')
    .from('prestador')
    .then(prestador => res.json(prestador))
});

router.post('/', async (req, res) => {
  db('prestador')
  .insert({
    nome:  req.body.nome,
	telefone:  req.body.telefone,
	email:  req.body.email
    },
    ['nome','telefone','email'])
  .then(  res.status (200).json ( { message: "Prestador incluído com sucesso." }))
  .catch (err => res.status(500).json ({ message: 'Erro ao inserir prestador: ${err.message}'}))
});

router.put('/:id', async (req, res) => {
    let id = Number.parseInt(req.params.id);

    if (id > 0) {
        db('prestador')
            .where('id', id)
            .update({
                telefone: req.body.telefone,
                email: req.body.email 
            },
            ['id','telefone','email'])
            .then (res.status (200).json ( { message: "Prestador alterado com sucesso." }))
    }
    else {
        res.status (404).json ( { message: "Esse prestador não existe." })
    }  

});

router.delete('/:id', async (req, res) => {
    let id = Number.parseInt(req.params.id);
    if (id > 0) {
        db('prestador')
        .where('id', id)
        .del()
        .then(  res.status (200).json ( { message: "Prestador excluído com sucesso." }))            
    } else {
      res.status (404).json ( { message: "Esse prestador não existe." })
    } 
});

module.exports = router;
