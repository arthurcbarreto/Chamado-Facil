-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: chamado_facil
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administrador`
--

DROP TABLE IF EXISTS `administrador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrador` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `cargo` varchar(80) NOT NULL,
  `cnpj_empresa` char(18) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_cnpj_empresa_idx` (`cnpj_empresa`),
  CONSTRAINT `fk_cnpj_empresa` FOREIGN KEY (`cnpj_empresa`) REFERENCES `empresa` (`cnpj`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrador`
--

LOCK TABLES `administrador` WRITE;
/*!40000 ALTER TABLE `administrador` DISABLE KEYS */;
INSERT INTO `administrador` VALUES (2,'João','joao@email.com','$2a$10$B97wBow1skAkE3eTWkJN5O.nZ7rrKfON.cSOACdNa36QncQ3hLUDa','Administrador','00111222000133');
/*!40000 ALTER TABLE `administrador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ambulancia`
--

DROP TABLE IF EXISTS `ambulancia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ambulancia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `placa` varchar(10) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `cnpj_empresa` char(18) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `placa` (`placa`),
  KEY `fk_cnpj_empresa_idx` (`cnpj_empresa`),
  CONSTRAINT `fk_cnpj_empresa_ambulancia` FOREIGN KEY (`cnpj_empresa`) REFERENCES `empresa` (`cnpj`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ambulancia`
--

LOCK TABLES `ambulancia` WRITE;
/*!40000 ALTER TABLE `ambulancia` DISABLE KEYS */;
INSERT INTO `ambulancia` VALUES (4,'ABC-1234','SIMPLES','DISPONIVEL','00111222000133'),(5,'YGH-5432','UTI','DISPONIVEL','00111222000133');
/*!40000 ALTER TABLE `ambulancia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chamado`
--

DROP TABLE IF EXISTS `chamado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chamado` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dt_hora_pedido` datetime NOT NULL DEFAULT current_timestamp(),
  `dt_hora_atendimento` datetime DEFAULT NULL,
  `dt_hora_conclusao` datetime DEFAULT NULL,
  `sintomas` text NOT NULL,
  `gravidade` enum('BAIXA','MEDIA','ALTA','CRITICA') NOT NULL,
  `status` enum('ABERTO','EM_ATENDIMENTO','CONCLUIDO','CANCELADO') NOT NULL DEFAULT 'ABERTO',
  `cpf_usuario` varchar(14) NOT NULL,
  `id_endereco` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_id_endereco` (`id_endereco`),
  KEY `fk_cpf_usuario_idx` (`cpf_usuario`),
  CONSTRAINT `fk_cpf_usuario` FOREIGN KEY (`cpf_usuario`) REFERENCES `usuario` (`cpf`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_id_endereco` FOREIGN KEY (`id_endereco`) REFERENCES `endereco` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chamado`
--

LOCK TABLES `chamado` WRITE;
/*!40000 ALTER TABLE `chamado` DISABLE KEYS */;
INSERT INTO `chamado` VALUES (1,'2026-05-14 20:19:31','2026-05-16 17:12:29','2026-05-16 17:16:51','Dor no peito','MEDIA','CONCLUIDO','00000000000',5),(2,'2026-05-17 21:06:40','2026-05-17 21:08:34','2026-05-17 21:08:57','Queda e bateu a cabeça','ALTA','CONCLUIDO','00000000000',6),(3,'2026-05-18 02:08:19','2026-05-18 02:08:59','2026-05-18 02:09:04','Tomou um tiro no peito','CRITICA','CONCLUIDO','00000000000',7),(4,'2026-05-22 00:05:57','2026-05-22 00:08:43','2026-05-22 00:08:48','Convulsão','CRITICA','CONCLUIDO','00000000000',8),(5,'2026-05-22 00:16:09','2026-05-22 00:16:27','2026-05-22 00:16:33','Fratura exposta','MEDIA','CONCLUIDO','00000000000',9),(6,'2026-05-22 16:12:51','2026-05-22 16:13:36','2026-05-22 16:13:43','Tossindo sangue','BAIXA','CONCLUIDO','00000000000',10);
/*!40000 ALTER TABLE `chamado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chamado_ambulancia`
--

DROP TABLE IF EXISTS `chamado_ambulancia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chamado_ambulancia` (
  `id_chamado` int(11) NOT NULL,
  `id_ambulancia` int(11) NOT NULL,
  PRIMARY KEY (`id_chamado`,`id_ambulancia`),
  KEY `fk_ca_ambulancia` (`id_ambulancia`),
  CONSTRAINT `fk_ca_ambulancia` FOREIGN KEY (`id_ambulancia`) REFERENCES `ambulancia` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ca_chamado` FOREIGN KEY (`id_chamado`) REFERENCES `chamado` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chamado_ambulancia`
--

LOCK TABLES `chamado_ambulancia` WRITE;
/*!40000 ALTER TABLE `chamado_ambulancia` DISABLE KEYS */;
INSERT INTO `chamado_ambulancia` VALUES (1,4),(2,4),(3,4),(4,4),(5,4),(6,4);
/*!40000 ALTER TABLE `chamado_ambulancia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresa`
--

DROP TABLE IF EXISTS `empresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresa` (
  `cnpj` char(14) NOT NULL,
  `nome` varchar(120) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `id_endereco` int(11) NOT NULL,
  PRIMARY KEY (`cnpj`),
  KEY `fk_empresa_endereco` (`id_endereco`),
  CONSTRAINT `fk_empresa_endereco` FOREIGN KEY (`id_endereco`) REFERENCES `endereco` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresa`
--

LOCK TABLES `empresa` WRITE;
/*!40000 ALTER TABLE `empresa` DISABLE KEYS */;
INSERT INTO `empresa` VALUES ('00111222000133','Vitalmed','(71) 3312-8183',1);
/*!40000 ALTER TABLE `empresa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `endereco`
--

DROP TABLE IF EXISTS `endereco`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `endereco` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `logradouro` varchar(150) NOT NULL,
  `numero` varchar(10) NOT NULL,
  `bairro` varchar(80) NOT NULL,
  `cidade` varchar(80) NOT NULL,
  `estado` char(2) NOT NULL,
  `cep` varchar(9) NOT NULL,
  `coord_gps` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `endereco`
--

LOCK TABLES `endereco` WRITE;
/*!40000 ALTER TABLE `endereco` DISABLE KEYS */;
INSERT INTO `endereco` VALUES (1,'Rua A','33','Barra','Salvador','BA','40400090',NULL),(5,'Rua A','22','Boa viagem','Salvador','BA','40000000',NULL),(6,'Rua B','33','Monte Serrat','Salvador','BA','40120000',NULL),(7,'Rua C','44','Fazenda Grande','Salvador','BA','40245076',NULL),(8,'Rua X','145','Pelourinho','Salvador','BA','47897700',NULL),(9,'Rua H','123','Graça','Salvador','BA','40000000',NULL),(10,'Rua F','321','Centro','Salvador','BA','33333333',NULL);
/*!40000 ALTER TABLE `endereco` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipe_medica`
--

DROP TABLE IF EXISTS `equipe_medica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipe_medica` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `especialidade` varchar(100) NOT NULL,
  `id_ambulancia` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_ambulancia` (`id_ambulancia`),
  CONSTRAINT `fk_equipe_ambulancia` FOREIGN KEY (`id_ambulancia`) REFERENCES `ambulancia` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipe_medica`
--

LOCK TABLES `equipe_medica` WRITE;
/*!40000 ALTER TABLE `equipe_medica` DISABLE KEYS */;
INSERT INTO `equipe_medica` VALUES (1,'Equipe 1','Emergência SImples',4),(2,'Equipe 2','UTI',5);
/*!40000 ALTER TABLE `equipe_medica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipe_membros`
--

DROP TABLE IF EXISTS `equipe_membros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipe_membros` (
  `id_equipe` int(11) NOT NULL,
  `membro` varchar(255) DEFAULT NULL,
  KEY `FKdar9pwwlsxjwnnhq64je3hoxw` (`id_equipe`),
  CONSTRAINT `FKdar9pwwlsxjwnnhq64je3hoxw` FOREIGN KEY (`id_equipe`) REFERENCES `equipe_medica` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipe_membros`
--

LOCK TABLES `equipe_membros` WRITE;
/*!40000 ALTER TABLE `equipe_membros` DISABLE KEYS */;
INSERT INTO `equipe_membros` VALUES (1,'Lucas'),(1,'Claudio'),(2,'Junior'),(2,'Vinicius'),(2,'Carlos');
/*!40000 ALTER TABLE `equipe_membros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plano`
--

DROP TABLE IF EXISTS `plano`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plano` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  `cnpj_empresa` char(18) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cnpj_empresa_plano_idx` (`cnpj_empresa`),
  CONSTRAINT `fk_cnpj_empresa_plano` FOREIGN KEY (`cnpj_empresa`) REFERENCES `empresa` (`cnpj`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plano`
--

LOCK TABLES `plano` WRITE;
/*!40000 ALTER TABLE `plano` DISABLE KEYS */;
INSERT INTO `plano` VALUES (1,'Plano UTI','Emergencia UTI','00111222000133'),(2,'Plano Simples','Emergencia Simples','00111222000133');
/*!40000 ALTER TABLE `plano` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `cpf` varchar(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `dt_nasc` date NOT NULL,
  `id_plano` int(11) NOT NULL,
  PRIMARY KEY (`cpf`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_usuario_plano` (`id_plano`),
  CONSTRAINT `fk_usuario_plano` FOREIGN KEY (`id_plano`) REFERENCES `plano` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES ('00000000000','Arthur Barreto','arthur@email.com','$2a$10$MidC.FCJN2KzthccF4vBkO2b51M2qrFfP7u9SUau6zw9fcWBxJhqe','2006-03-22',2),('11111111111','Couto Barreto','barreto@email.com','$2a$10$6Zskj.hkSplD0kbvRsFJ7.r48Ti0WGRt1KUcqKytRMcLk1DAflTvC','2000-03-26',1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-04  1:35:22
