# Agendamento
Sistema de agendamento de horários de atendimento.

# Descrição dos requisitos funcionais

- Cadastro de Usuários
- Cadastro de Prestadores
- Cadastro de Serviços
- Cadastro de Serviços por Prestadores
- Agendamento de Horário

# Descrição dos requisitos não funcionais:

- Publicação do sistema em ambiente web
- Suporte à responsividade
- Persistência de dados em banco de dados relacional MySQL
- Utilização de framework Express do NodeJs para backend e JS, CSS, BootStrap para frontend
- Utilização de API REST desenvolvido em NodeJS para ser consumida pelo frontend
- Utilização do GitHub para controle de versões
- Implementação do GitHub Actions para pipelines CI/CD
- Hospedagem da aplicação em ambiente AWS utilizando o serviço EC2 + RDS

# Variáveis de Ambiente
- HOST_BD ='Host do servidor de Banco de Dados'
- USER_BD ='Usuário de acesso ao Banco de Dados'
- PASSWORD_BD = 'Senha do usuário de acesso ao Banco de Dados'

- HOST_API = 'EndPoint que a API Responde'
- EMAIL = 'E-mail que irá enviar os e-mails da aplicação'
- PASSWORD_EMAIL='Senha do e-mail que vai enviar as mensagens'

# Diagrama de deployment
![image](https://github.com/juliano-agios/Agendamento/assets/106352568/77c582bd-0ed5-4b70-8f18-fafe2f0ac0c8)

# Script de criação de banco de dados.

- CREATE TABLE agendamento (
   id INTEGER NOT NULL AUTO_INCREMENT,
   servicosPrestados_id INTEGER UNSIGNED NOT NULL,
   usuario_id INTEGER NOT NULL,
   dataAgendamento DATE NOT NULL,
   horaInicial TIME NOT NULL,
   horaFinal TIME NOT NULL,
   situacao INTEGER UNSIGNED NULL,
   PRIMARY KEY(id),
   INDEX horario_FKIndex2(servicosPrestados_id),
   INDEX horario_FKIndex3(usuario_id)
);
  
- CREATE TABLE prestador (
    id INTEGER NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(100) NOT NULL,
    email VARCHAR(100) NULL,
    PRIMARY KEY(id)
  );
  
- CREATE TABLE servico (
    id INTEGER NOT NULL AUTO_INCREMENT,
    descricao VARCHAR(100) NULL,
    PRIMARY KEY(id)
  );
  
- CREATE TABLE servicosPrestados (
    id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    servico_id INTEGER NOT NULL,
    prestador_id INTEGER NOT NULL,
    tempo INTEGER UNSIGNED NULL,
    PRIMARY KEY(id),
    INDEX prestador_servico_FKIndex1(servico_id),
    INDEX prestador_servico_FKIndex2(prestador_id)
  );
  
- CREATE TABLE usuario (
    id INTEGER NOT NULL AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    senha VARCHAR(200) NOT NULL,
    roles VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NULL,
    PRIMARY KEY(id)
  );

![image](https://github.com/juliano-agios/Agendamento/assets/106352568/cc91c1da-6111-42a6-abe6-7dff34a8ca92)


