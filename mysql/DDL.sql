-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema banco_prova_saep
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema banco_prova_saep
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `banco_prova_saep` DEFAULT CHARACTER SET utf8mb4 ;
USE `banco_prova_saep` ;

-- -----------------------------------------------------
-- Table `banco_prova_saep`.`areas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `banco_prova_saep`.`areas` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `area` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 31
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `banco_prova_saep`.`questoes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `banco_prova_saep`.`questoes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `titulo` LONGTEXT NOT NULL,
  `resposta_a` LONGTEXT NOT NULL,
  `resposta_b` LONGTEXT NOT NULL,
  `resposta_c` LONGTEXT NOT NULL,
  `resposta_d` LONGTEXT NOT NULL,
  `resposta_e` LONGTEXT NOT NULL,
  `questao_certa` CHAR(1) NOT NULL,
  `ano_da_prova` VARCHAR(200) NULL DEFAULT NULL,
  `url_anexo` LONGTEXT NULL DEFAULT NULL,
  `created` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
  `confianca` FLOAT NULL DEFAULT NULL,
  `id_area` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_questoes_areas` (`id_area` ASC) VISIBLE,
  CONSTRAINT `fk_questoes_areas`
    FOREIGN KEY (`id_area`)
    REFERENCES `banco_prova_saep`.`areas` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 289
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `banco_prova_saep`.`provas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `banco_prova_saep`.`provas` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `id_questao` INT(11) NOT NULL,
  `sub_token` CHAR(6) NOT NULL,
  `full_token` VARCHAR(255) NOT NULL,
  `tempo_minutos` INT(11) NOT NULL DEFAULT 170,
  `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  INDEX `fk_provas_questoes` (`id_questao` ASC) VISIBLE,
  CONSTRAINT `fk_provas_questoes`
    FOREIGN KEY (`id_questao`)
    REFERENCES `banco_prova_saep`.`questoes` (`id`)
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 278
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `banco_prova_saep`.`respostas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `banco_prova_saep`.`respostas` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `id_questao` INT(11) NOT NULL,
  `resposta_aluno` CHAR(1) NOT NULL,
  `resposta_certa` CHAR(1) NOT NULL,
  `token` CHAR(6) NOT NULL,
  `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  INDEX `fk_provas_questoes1` (`id_questao` ASC) VISIBLE,
  CONSTRAINT `fk_provas_questoes1`
    FOREIGN KEY (`id_questao`)
    REFERENCES `banco_prova_saep`.`questoes` (`id`)
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 5592
DEFAULT CHARACTER SET = utf8mb4;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
