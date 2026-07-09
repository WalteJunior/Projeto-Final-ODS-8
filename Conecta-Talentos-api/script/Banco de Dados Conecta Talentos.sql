USE `conectawork`;

-- =====================================================================
-- 1) VAGAS: adicionar os campos do formulário "Publicar Vaga"
--    (nível de senioridade, localização, remoto, faixa salarial,
--     requisitos e benefícios)
-- =====================================================================
ALTER TABLE `conectawork`.`vagas`
  ADD COLUMN `nivel_senioridade` VARCHAR(255) NULL DEFAULT NULL AFTER `area`,
  ADD COLUMN `localizacao`       VARCHAR(255) NULL DEFAULT NULL AFTER `nivel_senioridade`,
  ADD COLUMN `remoto`            BIT(1)       NULL DEFAULT b'0'  AFTER `localizacao`,
  ADD COLUMN `salario_minimo`    DOUBLE       NULL DEFAULT NULL AFTER `salario`,
  ADD COLUMN `salario_maximo`    DOUBLE       NULL DEFAULT NULL AFTER `salario_minimo`,
  ADD COLUMN `requisitos`        TEXT         NULL AFTER `descricao`,
  ADD COLUMN `beneficios`        TEXT         NULL AFTER `requisitos`;

-- =====================================================================
-- 2) SERVICOS: hoje um serviço só pode pertencer a uma PESSOA
--    (pessoas_id é NOT NULL e faz parte da chave primária composta).
--    Para uma EMPRESA também poder publicar serviço, precisamos:
--      a) trocar a PK composta (id, pessoas_id) por PK simples (id)
--      b) tornar pessoas_id opcional (NULL)
--      c) adicionar empresa_id (opcional, com FK para empresa)
--      d) garantir que sempre haja um dono (pessoa OU empresa, nunca os 2 e nunca nenhum)
-- =====================================================================

-- a) remove a FK atual (necessário antes de mexer na PK)
ALTER TABLE `conectawork`.`servicos`
  DROP FOREIGN KEY `fk_servicos_pessoas1`;

-- b) troca a chave primária composta por uma chave primária simples (id)
ALTER TABLE `conectawork`.`servicos`
  DROP PRIMARY KEY,
  ADD PRIMARY KEY (`id`);

-- c) pessoas_id passa a ser opcional + adiciona empresa_id opcional
ALTER TABLE `conectawork`.`servicos`
  MODIFY COLUMN `pessoas_id` INT NULL,
  ADD COLUMN `empresa_id` INT NULL DEFAULT NULL AFTER `pessoas_id`;

-- d) recria as duas FKs (pessoa e empresa)
ALTER TABLE `conectawork`.`servicos`
  ADD CONSTRAINT `fk_servicos_pessoas1`
    FOREIGN KEY (`pessoas_id`) REFERENCES `conectawork`.`pessoas` (`id`),
  ADD CONSTRAINT `fk_servicos_empresa1`
    FOREIGN KEY (`empresa_id`) REFERENCES `conectawork`.`empresa` (`id`);

-- e) garante que todo serviço tenha exatamente um dono (pessoa OU empresa)
ALTER TABLE `conectawork`.`servicos`
  ADD CONSTRAINT `chk_servico_dono`
    CHECK (
      (`pessoas_id` IS NOT NULL AND `empresa_id` IS NULL)
      OR
      (`pessoas_id` IS NULL AND `empresa_id` IS NOT NULL)
    );