const express = require('express');
const router = express.Router();
const db = require('../Config/Database.js');

router.get('/', async (req, res) => {
    db
    .select('*')
    .from('servicosPrestados')
    .then(servicosPrestados => res.json(servicosPrestados))
});

router.post('/', async (req, res) => {
  db('servicosPrestados')
  .insert({
    servico_id: req.body.servico_id,
	  prestador_id: req.body.prestador_id,
	  tempo: req.body.tempo
    },
    ['servico_id','prestador_id','tempo'])
  .then(  res.status (200).json ( { message: "Serviço prestado incluído com sucesso." }))
  .catch (err => res.status(500).json ({ message: 'Erro ao inserir serviço prestador: ${err.message}'}))
});

router.put('/:id', async (req, res) => {
    let id = Number.parseInt(req.params.id);

    if (id > 0) {
        db('servicosPrestados')
            .where('id', id)
            .update({
              tempo: req.body.tempo
            },
            ['id','tempo'])
            .then (res.status (200).json ( { message: "Serviço prestado alterado com sucesso." }))
    }
    else {
        res.status (404).json ( { message: "Esse serviço prestado não existe." })
    }  

});

router.delete('/:id', async (req, res) => {
    let id = Number.parseInt(req.params.id);
    if (id > 0) {
        db('servicosPrestados')
        .where('id', id)
        .del()
        .then(  res.status (200).json ( { message: "Serviço prestado excluído com sucesso." }))            
    } else {
      res.status (404).json ( { message: "Esse serviço prestado não existe." })
    } 
});

module.exports = router;
