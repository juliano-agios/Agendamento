const express = require('express');
const router = express.Router();
const db = require('../Config/Database.js');

router.get('/', async (req, res) => {
  const { id } = req.query;
  let query = db.select('*').from('servico');
  if (id) {
    query = query.where('id', id);
  }
  query
    .then(servicos => {console.log(servicos); res.json(servicos)})
    .catch(err => res.status(500).json({ message: `Erro ao buscar servicos: ${err.message}` }));
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
      const servico = await db.select('*').from('servico').where({ id }).first();
      
      if (!servico) {
        return res.status(404).json({ message: 'Servico não encontrado' });
      }
      
      res.json(servico);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
});
  
router.put('/:id', async (req, res) => {
  let id = Number.parseInt(req.params.id);
  if (id > 0) {
      db('servico')
          .where('id', id)
          .update({
              descricao: req.body.descricao
          },
          ['id','descricao'])
          .then (res.status (200).json ( { message: "Serviço alterado com sucesso." }))
  }
  else {
      res.status (404).json ( { message: "Esse serviço não existe." })
  }  
});

router.post('/', async (req, res) => {
  db('servico')
  .insert({
    descricao:  req.body.descricao},
    ['descricao'])
  .then(  res.status (200).json ( { message: "Servico incluído com sucesso." }))
  .catch (err => res.status(500).json ({ message: 'Erro ao inserir Servico: ${err.message}'}))
});

router.put('/:id', async (req, res) => {
  let id = Number.parseInt(req.params.id);
  if (id > 0) {
      db('servico')
          .where('id', id)
          .update({
              descricao: req.body.descricao
          },
          ['id','descricao'])
          .then (res.status (200).json ( { message: "Serviço alterado com sucesso." }))
  }
  else {
      res.status (404).json ( { message: "Esse serviço não existe." })
  }  
});

router.delete('/:id', async (req, res) => {
  let id = Number.parseInt(req.params.id);
  if (id > 0) {
      db('servico')
      .where('id', id)
      .del()
      .then(  res.status (200).json ( { message: "Serviço excluído com sucesso." }))            
  } else {
    res.status (404).json ( { message: "Esse serviço não existe." })
  } 
});

module.exports = router;
