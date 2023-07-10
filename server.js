const dotenv = require('dotenv');
dotenv.config();

const express                    = require('express')
const app                        = express()

const apiRouterUsuario           = require('./Routes/apiRouterUsuario')
const apiRouterServico           = require('./Routes/apiRouterServico')
const apiRouterPrestador         = require('./Routes/apiRouterPrestador')
const apiRouterServicosPrestados = require('./Routes/apiRouterServicosPrestados')
const apiRouterAgendamento       = require('./Routes/apiRouterAgendamento')
const apiRouterEnviarEmail       = require('./Routes/apiRouterEnviarEmail')

const port = process.env.PORT || 3000;

app.use(express.json ())
app.use(express.urlencoded({ extended: true }));

/*
// realiza log da requisição
app.use('*', function(req, res, next) {
    console.log("req.method:", req.method)
    console.log("req.url:", req.url)
    console.log("req.query:", req.query)
    console.log("req.path:", req.path)
    console.log("req.body:", req.body)  
    next ()
})  
*/

app.use('/api/usuario', apiRouterUsuario);
app.use('/api/servico', apiRouterServico);
app.use('/api/prestador', apiRouterPrestador);
app.use('/api/servicosPrestados', apiRouterServicosPrestados);
app.use('/api/agendamento', apiRouterAgendamento);
app.use('/api/enviar-email', apiRouterEnviarEmail);

app.use('/site', express.static('public'));

// Inicializa o servidor HTTP na porta 3000
app.listen(port, function () {
    console.log('Servidor rodando na porta 3000')
})


