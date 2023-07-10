const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {

  var { email, titulo, mensagem } = req.body;

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
          user: 'agenda@agios.tech', // Seu endereço de e-mail
          pass: process.env.PASSWORD_EMAIL // Sua senha de e-mail
        }
      });      
    
      const mailOptions = {
        from: 'agenda@agios.tech',
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
