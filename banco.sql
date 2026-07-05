-- ============================================================
--  CHAMADO FÁCIL — Script SQL Completo
--  Banco de Dados: MySQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS chamado_facil
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE chamado_facil;

-- ============================================================
-- 1. ENDERECO
-- ============================================================
CREATE TABLE IF NOT EXISTS ENDERECO (
  id          INT           NOT NULL AUTO_INCREMENT,
  logradouro  VARCHAR(150)  NOT NULL,
  numero      VARCHAR(10)   NOT NULL,
  bairro      VARCHAR(80)   NOT NULL,
  cidade      VARCHAR(80)   NOT NULL,
  estado      CHAR(2)       NOT NULL,
  cep         CHAR(8)       NOT NULL,
  coord_gps   VARCHAR(50)   NULL,
  PRIMARY KEY (id)
);

-- ============================================================
-- 2. EMPRESA
-- ============================================================
CREATE TABLE IF NOT EXISTS EMPRESA (
  cnpj          CHAR(14)      NOT NULL,
  nome          VARCHAR(120)  NOT NULL,
  telefone      VARCHAR(20)   NOT NULL,
  id_endereco   INT           NOT NULL,
  PRIMARY KEY (cnpj),
  CONSTRAINT fk_empresa_endereco
    FOREIGN KEY (id_endereco) REFERENCES ENDERECO(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 3. PLANO
-- ============================================================
CREATE TABLE IF NOT EXISTS PLANO (
  id           INT          NOT NULL AUTO_INCREMENT,
  nome         VARCHAR(100) NOT NULL,
  descricao    TEXT         NULL,
  cnpj_empresa CHAR(14)     NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_plano_empresa
    FOREIGN KEY (cnpj_empresa) REFERENCES EMPRESA(cnpj)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 4. USUARIO
-- ============================================================
CREATE TABLE IF NOT EXISTS USUARIO (
  cpf         CHAR(11)      NOT NULL,
  nome        VARCHAR(100)  NOT NULL,
  email       VARCHAR(100)  NOT NULL UNIQUE,
  senha       VARCHAR(255)  NOT NULL,
  dt_nasc     DATE          NOT NULL,
  id_plano    INT           NOT NULL,
  PRIMARY KEY (cpf),
  CONSTRAINT fk_usuario_plano
    FOREIGN KEY (id_plano) REFERENCES PLANO(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 5. ADMINISTRADOR
-- ============================================================
CREATE TABLE IF NOT EXISTS ADMINISTRADOR (
  id           INT          NOT NULL AUTO_INCREMENT,
  nome         VARCHAR(100) NOT NULL,
  email        VARCHAR(100) NOT NULL UNIQUE,
  senha        VARCHAR(255) NOT NULL,
  cargo        VARCHAR(80)  NOT NULL,
  cnpj_empresa CHAR(14)     NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_admin_empresa
    FOREIGN KEY (cnpj_empresa) REFERENCES EMPRESA(cnpj)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 6. AMBULANCIA
-- ============================================================
CREATE TABLE IF NOT EXISTS AMBULANCIA (
  id           INT          NOT NULL AUTO_INCREMENT,
  placa        VARCHAR(10)  NOT NULL UNIQUE,
  tipo         ENUM('UTI', 'Simples') NOT NULL,
  status       ENUM('Disponível', 'Em atendimento', 'Em manutenção')
               NOT NULL DEFAULT 'Disponível',
  cnpj_empresa CHAR(14)     NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_ambulancia_empresa
    FOREIGN KEY (cnpj_empresa) REFERENCES EMPRESA(cnpj)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 7. EQUIPE_MEDICA
-- ============================================================
CREATE TABLE IF NOT EXISTS EQUIPE_MEDICA (
  id            INT          NOT NULL AUTO_INCREMENT,
  nome          VARCHAR(100) NOT NULL,
  especialidade VARCHAR(100) NOT NULL,
  id_ambulancia INT          NULL UNIQUE,
  PRIMARY KEY (id),
  CONSTRAINT fk_equipe_ambulancia
    FOREIGN KEY (id_ambulancia) REFERENCES AMBULANCIA(id)
    ON DELETE SET NULL ON UPDATE CASCADE
);

-- ============================================================
-- 8. EQUIPE_MEMBROS
-- ============================================================
CREATE TABLE IF NOT EXISTS EQUIPE_MEMBROS (
  id_equipe INT          NOT NULL,
  membro    VARCHAR(100) NOT NULL,
  CONSTRAINT fk_membros_equipe
    FOREIGN KEY (id_equipe) REFERENCES EQUIPE_MEDICA(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 9. CHAMADO
-- ============================================================
CREATE TABLE IF NOT EXISTS CHAMADO (
  id                  INT      NOT NULL AUTO_INCREMENT,
  dt_hora_pedido      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dt_hora_atendimento DATETIME NULL,
  dt_hora_conclusao   DATETIME NULL,
  sintomas            TEXT     NOT NULL,
  gravidade           ENUM('Leve', 'Moderada', 'Grave', 'Crítica') NOT NULL,
  status              ENUM('Aberto', 'Em atendimento', 'Concluído', 'Cancelado')
                      NOT NULL DEFAULT 'Aberto',
  cpf_usuario         CHAR(11) NOT NULL,
  id_endereco         INT      NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_chamado_usuario
    FOREIGN KEY (cpf_usuario) REFERENCES USUARIO(cpf)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_chamado_endereco
    FOREIGN KEY (id_endereco) REFERENCES ENDERECO(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 10. CHAMADO_AMBULANCIA
-- ============================================================
CREATE TABLE IF NOT EXISTS CHAMADO_AMBULANCIA (
  id_chamado    INT NOT NULL,
  id_ambulancia INT NOT NULL,
  PRIMARY KEY (id_chamado, id_ambulancia),
  CONSTRAINT fk_ca_chamado
    FOREIGN KEY (id_chamado)    REFERENCES CHAMADO(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ca_ambulancia
    FOREIGN KEY (id_ambulancia) REFERENCES AMBULANCIA(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- DADOS INICIAIS
-- ============================================================
INSERT INTO ENDERECO (logradouro, numero, bairro, cidade, estado, cep)
  VALUES ('Rua A', '33', 'Barra', 'Salvador', 'BA', '40400090');

INSERT INTO EMPRESA (cnpj, nome, telefone, id_endereco)
  VALUES ('00111222000133', 'Vitalmed', '(71) 3312-8183', 1);

INSERT INTO PLANO (nome, descricao, cnpj_empresa)
  VALUES ('Plano A', 'Emergencia UTI', '00111222000133');

INSERT INTO PLANO (nome, descricao, cnpj_empresa)
  VALUES ('Plano B', 'Emergencia simples', '00111222000133');

INSERT INTO ADMINISTRADOR (nome, email, senha, cargo, cnpj_empresa)
  VALUES ('João', 'joao@email.com', '315214@#', 'Administrador', '00111222000133');