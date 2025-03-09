import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsuarioTable1741311123671 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE "usuario" (
            "id" varchar PRIMARY KEY NOT NULL,
            "nome" varchar(60) NOT NULL,
            "usuario" varchar(60) NOT NULL UNIQUE,
            "senha" varchar(255) NOT NULL,
            "perfil" varchar(20) NOT NULL,
            "situacao" varchar(10) NOT NULL,
            "dt_inclusao" datetime DEFAULT CURRENT_TIMESTAMP
          )
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "usuario"`);
      }
    }