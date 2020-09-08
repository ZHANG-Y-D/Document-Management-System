-- MySQL dump 10.13  Distrib 8.0.21, for macos10.15 (x86_64)
--
-- Host: localhost    Database: db_gestione_documenti
-- ------------------------------------------------------
-- Server version	8.0.21

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
-- Table structure for table `Document`
--

DROP TABLE IF EXISTS `Document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Document` (
  `DocumentName` varchar(45) NOT NULL,
  `SubFolderName` varchar(45) NOT NULL,
  `FolderName` varchar(45) NOT NULL,
  `Date` date NOT NULL,
  `Summary` varchar(200) NOT NULL,
  `Type` varchar(45) NOT NULL,
  PRIMARY KEY (`DocumentName`,`SubFolderName`,`FolderName`),
  KEY `SubFolderName` (`SubFolderName`,`FolderName`),
  CONSTRAINT `document_ibfk_1` FOREIGN KEY (`SubFolderName`, `FolderName`) REFERENCES `SubFolder` (`SubFolderName`, `FolderName`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Document`
--

LOCK TABLES `Document` WRITE;
/*!40000 ALTER TABLE `Document` DISABLE KEYS */;
INSERT INTO `Document` VALUES ('00','Analisi2','Esercizi','2020-09-09','ee','pdf'),('123456','Analisi2','Esercizi','2020-09-09','asd','pdf'),('123e3as456','Analisi2','Esercizi','2021-01-03','30 Lode','jpg'),('123e3das456','Analisi2','Esercizi','2021-01-03','VABE','jpg'),('12d3456','Informatica','Teoria','2020-01-03','OKOK','pdf'),('12dd3456','Malta','Esami','2020-01-03','OKVABEOK','pdf'),('12dqe3456','Malta','Esami','2020-01-03','OKOK','pdf'),('1ads21456','Italia','Esami','2120-01-05','OKOK','pdf'),('1dasqe3456','Analisi2','Esercizi','2020-01-03','OKOK','pdf'),('1s23','Malta','Esami','2010-01-03','Belissimo','word'),('33','Analisi2','Esercizi','2020-09-09','s','pdf'),('4casdfd56','Malta','Esami','2020-01-03','VABE','avi'),('4cfd56','Informatica','Teoria','2020-01-03','OKOK','pdf'),('7cd89','Informatica','Teoria','2020-01-03','OKOK','pdf'),('7cdas9','Informatica','Teoria','2020-01-05','OKOK','pdf'),('aaa','Informatica','Teoria','2020-09-09','asd','pdf'),('afdasfsf','Informatica','Teoria','2030-01-05','VABE','mov'),('affsf','Malta','Esami','2020-01-03','OKOK','pdf'),('cfgt','Analisi2','Esercizi','2020-09-09','13e','pdf'),('fdwef','Malta','Esami','2020-09-09','asd','pdf'),('qaz','Mate','Corsi','2020-01-03','OKOK','pdf'),('qaz(1)','Europe','Corsi','2020-09-09','asd','pdf'),('qddasdwe','Analisi2','Esercizi','2020-01-03','OKOK','pdf'),('qddawe','Mate','Corsi','2020-01-03','Buongiorno','pdf'),('qddwe','Mate','Corsi','2020-01-03','OKOK','pdf'),('s23edg','Analisi2','Esercizi','2020-01-03','OKOK','pdf'),('sd3edg','Mate','Corsi','2020-01-05','VABE','exe'),('sdga','Mate','Corsi','2020-09-09','13e','pdf'),('tddasweyu','Italia','Esami','2020-01-03','OKOK','pdf'),('tddasyu','Italia','Esami','2020-01-03','Fatto bene','pdf'),('tdweyu','Italia','Esami','2020-01-03','OKOK','pdf'),('xdwcb','Mate','Corsi','2020-01-03','OKOK','pdf');
/*!40000 ALTER TABLE `Document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Folder`
--

DROP TABLE IF EXISTS `Folder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Folder` (
  `FolderName` varchar(45) NOT NULL,
  `Date` date NOT NULL,
  PRIMARY KEY (`FolderName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Folder`
--

LOCK TABLES `Folder` WRITE;
/*!40000 ALTER TABLE `Folder` DISABLE KEYS */;
INSERT INTO `Folder` VALUES ('Corsi','2020-08-09'),('Esami','2020-02-01'),('Esercizi','2020-09-09'),('Teoria','2020-08-09');
/*!40000 ALTER TABLE `Folder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SubFolder`
--

DROP TABLE IF EXISTS `SubFolder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SubFolder` (
  `SubFolderName` varchar(45) NOT NULL,
  `FolderName` varchar(45) NOT NULL,
  `Date` date NOT NULL,
  PRIMARY KEY (`SubFolderName`,`FolderName`),
  KEY `NameFolder` (`FolderName`),
  CONSTRAINT `subfolder_ibfk_1` FOREIGN KEY (`FolderName`) REFERENCES `Folder` (`FolderName`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SubFolder`
--

LOCK TABLES `SubFolder` WRITE;
/*!40000 ALTER TABLE `SubFolder` DISABLE KEYS */;
INSERT INTO `SubFolder` VALUES ('Analisi2','Esercizi','2020-01-09'),('Europe','Corsi','2021-08-09'),('Informatica','Teoria','2020-05-20'),('Italia','Esami','2020-02-09'),('Malta','Esami','2020-01-09'),('Mate','Corsi','2020-08-09');
/*!40000 ALTER TABLE `SubFolder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `Username` varchar(45) NOT NULL,
  `Password` varchar(45) NOT NULL,
  `Email` varchar(255) NOT NULL,
  PRIMARY KEY (`Username`),
  CONSTRAINT `mailcheck` CHECK (regexp_like(`Email`,_utf8mb4'^(\\S+)\\@(\\S+).(\\S+)$'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('123','123','123@qq.com'),('abc','123','1@qq.com'),('abcds','1234','123@qq.xom'),('as','123','qq@qq.com'),('zhang','123','123@qq.com');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-09-01 10:41:48
