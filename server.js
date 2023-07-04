require('dotenv').config()

const express                    = require('express')
const app                        = express()
const { JsonWebTokenError }      = require('jsonwebtoken')

const apiRouterServico           = require('./Routes/apiRouterServico')
const apiRouterPrestador         = require('./Routes/apiRouterPrestador')
const apiRouterServicosPrestados = require('./Routes/apiRouterServicosPrestados')
const apiRouterAgendamento       = require('./Routes/apiRouterAgendamento')

const port = process.env.PORT || 3000;

app.use(express.json ())
app.use(express.urlencoded({ extended: true }));

app.use('/api/servico', apiRouterServico);
app.use('/api/prestador', apiRouterPrestador);
app.use('/api/servicosPrestados', apiRouterServicosPrestados);
app.use('/api/agendamento', apiRouterAgendamento);
app.use('/site', express.static('public'));

// Inicializa o servidor HTTP na porta 3000
app.listen(port, function () {
    console.log('Servidor rodando na porta 3000')
})


