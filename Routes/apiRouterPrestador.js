const express = require('express');
const router = express.Router();
const db = require('../Config/Database.js');

router.get('/', async (req, res) => {

  const { id } = req.query;

  let query = db.select('*').from('prestador');

  if (id) {
    query = query.where('id', id);
  }
  query
    .then(prestadores => {res.json(prestadores)})
    .catch(err => res.status(500).json({ message: `Erro ao buscar usuarios: ${err.message}` }));
});


router.get('/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
      const servico = await db.select('*').from('prestador').where({ id }).first();
      
      if (!servico) {
        return res.status(404).json({ message: 'Prestador não encontrado' });
      }
      
      res.json(servico);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
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
