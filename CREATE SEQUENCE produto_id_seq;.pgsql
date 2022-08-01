CREATE SEQUENCE produto_id_seq;
CREATE TABLE produto (
    id int4 NOT NULL DEFAULT nextval('produto_id_seq'),
    descricao varchar(200) NOT NULL,
    valor numeric NOT NULL DEFAULT 0,
    marca varchar(100) NULL,
    CONSTRAINT produto_pk PRIMARY KEY (id)
);
CREATE UNIQUE INDEX produto_id_idx ON public.produto USING btree (id);


INSERT INTO produto (descricao, valor, marca)
    VALUES('Arroz parboilizado 5Kg', 25, 'Tio João');
INSERT INTO produto (descricao, valor, marca)
    VALUES('Maionese 250gr', 7.2, 'Helmanns');
INSERT INTO produto (descricao, valor, marca)
    VALUES('Iogurte Natural 200ml', 2.5, 'Itambé');
INSERT INTO produto (descricao, valor, marca)
    VALUES('Nescau 400gr', 8, 'Nestlé');
INSERT INTO produto (descricao, valor, marca)
    VALUES('Batata Palha 180gr', 5.20, 'Chipps');
INSERT INTO produto (descricao, valor, marca)
    VALUES('Feijão Carioquinha', 5, 'Xap');

SELECT * FROM produto;