 

CREATE SEQUENCE usuario_id_seq; 

CREATE TABLE public.usuario ( 
    id numeric NOT NULL DEFAULT nextval('usuario_id_seq'), 
    nome varchar(200) NOT NULL, 
    email varchar(100) NOT NULL, 
    login varchar(100) NOT NULL, 
    senha varchar(100) NOT NULL, 
    roles varchar(200) NOT NULL DEFAULT 'USER', 
    CONSTRAINT usuario_pk PRIMARY KEY (id) 
); 

CREATE TABLE cliente (
    cpf numeric NOT NULL,
    nome varchar(200) NOT NULL,
    email varchar(200),
    CONSTRAINT cliente_pk PRIMARY KEY (cpf)
);
CREATE UNIQUE INDEX cliente_cpf_idx ON public.cliente USING btree (cpf);

INSERT INTO cliente (cpf, nome, email)  VALUES(02536978952, 'Juliano Caetano', 'juliano.bhmg@gmail.com');
INSERT INTO cliente (cpf, nome, email)  VALUES(12545548788, 'Raquel Pinheiro', 'lojaraquelpinheiro@gmail.com');
INSERT INTO cliente (cpf, nome, email)  VALUES(23232323232, 'Maria Lucia',     'jr.raquelpinheiro@gmail.com');
SELECT * FROM cliente;

INSERT INTO usuario (nome, login, senha, email, roles) VALUES('user', 'user', '$2a$08$cgWo0k133AqN7bfHTkKK8eedZRBlpZL08piXXQP521KOFXIF4sWha', 'user@abc.com.br', 'USER'); 
INSERT INTO usuario (nome, login, senha, email, roles) VALUES('admin', 'admin', '$2a$08$cgWo0k133AqN7bfHTkKK8eedZRBlpZL08piXXQP521KOFXIF4sWha', 'admini@abc.com.br', 'USER;ADMIN'); 
select * from usuario;

commit;


select * from cliente;
select * from usuario;

update usuario set senha = '$2a$08$Nj9Z6KQCz5sCsEkCADb9k.JIoH1v458nke2qfK3cfstUBjwO5NFjS' where nome = 'user';
update usuario set senha = '$2a$08$lfHbHT65GVXh1T1YEOZozOBdom5TrlgooJrEIA40g34bmGVR8Bqsu' where nome = 'admin';