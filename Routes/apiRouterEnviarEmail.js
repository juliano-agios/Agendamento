const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {

  var { email, titulo, mensagem } = req.body;

  if (!email) {
    // No formulário de contato não sabe para quem do fornecedor vai ser enviado a mensagem de contato
    // neste caso irá passar vazio e pegar a variavel d ambiente
    // Obter o valor da variável de ambiente
    email = process.env.EMAIL;
  }

  enviarEmail(email, titulo, mensagem)
    .then(() => {
      res.status(200).json({ message: 'E-mail enviado com sucesso' });
    })
    .catch((error) => {
      console.error('Erro ao enviar e-mail:', error);
      res.status(500).json({ message: 'Erro ao enviar o e-mail' });
    });
});

// Função para enviar o e-mail
function enviarEmail(email, titulo, mensagem) {
  return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true, // Usar SSL/TLS
        auth: {
          user: process.env.EMAIL, // Seu endereço de e-mail
          pass: process.env.PASSWORD_EMAIL // Sua senha de e-mail
        }
      });      
    
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: titulo,
        text: mensagem
      };    

      console.log("email:" + email);
      console.log("titulo:" + titulo);
      console.log("mensagem:" + mensagem);
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erro ao enviar e-mail:', error);
        } else {
          console.log('E-mail enviado:', info.response);
        }
      });
  });
};


module.exports = router;
