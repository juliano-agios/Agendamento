const express = require('express');
const router = express.Router();
const db = require('../Config/Database.js');

router.get('/', async (req, res) => {
  const { id, dataAgendamento, prestadorId, usuarioId, situacao } = req.query;

  let query = db.select('*').from('agendamento');

  if (id) {
    query = query.where('id', id);
  }

  if (dataAgendamento) {
    query = query.where('dataAgendamento', dataAgendamento);
  }

  if (prestadorId) {
    query = query.where('prestadorId', prestadorId);
  }

  if (usuarioId) {
    query = query.where('usuario_id', usuarioId);
  }

  if (situacao) {
    query = query.where('situacao', situacao);
  }  
  
  query
    .orderBy('dataAgendamento')
    .orderBy('horaInicial')
    .then(agendamentos => {res.json(agendamentos)})
    .catch(err => res.status(500).json({ message: `Erro ao buscar agendamentos: ${err.message}` }));
});

router.post('/', async (req, res) => {
  const {
    servicosPrestados_id,
    usuario_id,
    dataAgendamento,
    horaInicial,
    horaFinal,
    situacao
  } = req.body;

  db('agendamento')
    .insert({
      servicosPrestados_id,
      usuario_id,
      dataAgendamento,
      horaInicial,
      horaFinal,
      situacao
    })
    .then(() => res.status(200).json({ message: "Agendamento incluído com sucesso." }))
    .catch(err => res.status(500).json({ message: `Erro ao inserir o agendamento: ${err.message}` }));
});

router.put('/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id);
  const { situacao } = req.body;

  if (id > 0) {
    db('agendamento')
      .where('id', id)
      .update({ situacao })
      .then(() => res.status(200).json({ message: "Agendamento alterado com sucesso." }))
      .catch(err => res.status(500).json({ message: `Erro ao atualizar o agendamento: ${err.message}` }));
  } else {
    res.status(404).json({ message: "Esse agendamento não existe." });
  }
});

router.delete('/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id);

  if (id > 0) {
    db('agendamento')
      .where('id', id)
      .del()
      .then(() => res.status(200).json({ message: "Agendamento excluído com sucesso." }))
      .catch(err => res.status(500).json({ message: `Erro ao excluir o agendamento: ${err.message}` }));
  } else {
    res.status(404).json({ message: "Esse agendamento não existe." });
  }
});

module.exports = router;
