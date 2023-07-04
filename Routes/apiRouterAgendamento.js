const express = require('express');
const router = express.Router();
const db = require('../Config/Database.js');

router.get('/', async (req, res) => {
    db
    .select('*')
    .from('agendamento')
    .then(agendamento => res.json(agendamento))
});

router.post('/', async (req, res) => {
  db('agendamento')
  .insert({
    servicosPrestados_id: req.body.servicosPrestados_id,
    usuario_id: req.body.usuario_id,
    dataAgendamento: req.body.dataAgendamento,
	  horaInicial: req.body.horaInicial,
	  horaFinal: req.body.horaFinal,
    situacao: req.body.situacao
    },
    ['servicosPrestados_id','usuario_id','dataAgendamento', 'horaInicial', 'horaFinal', 'situacao'])
  .then(  res.status (200).json ( { message: "Agendamento incluído com sucesso." }))
  .catch (err => res.status(500).json ({ message: 'Erro ao inserir o agendamento: ${err.message}'}))
});

router.put('/:id', async (req, res) => {
    let id = Number.parseInt(req.params.id);

    if (id > 0) {
        db('agendamento')
            .where('id', id)
            .update({
              situacao: req.body.situacao
            },
            ['id','situacao'])
            .then (res.status (200).json ( { message: "Agendamento alterado com sucesso." }))
    }
    else {
        res.status (404).json ( { message: "Esse agendamento não existe." })
    }  

});

router.delete('/:id', async (req, res) => {
    let id = Number.parseInt(req.params.id);
    if (id > 0) {
        db('agendamento')
        .where('id', id)
        .del()
        .then(  res.status (200).json ( { message: "Agendamento excluído com sucesso." }))            
    } else {
      res.status (404).json ( { message: "Esse agendamento não existe." })
    } 
});

module.exports = router;
