import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAvaliacaoIMCTable1741311139121 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE "avaliacao_imc" (
            "id" varchar PRIMARY KEY NOT NULL,
            "altura" decimal NOT NULL,
            "peso" decimal NOT NULL,
            "imc" decimal NOT NULL,
            "classificacao" varchar(30) NOT NULL,
            "id_usuario_avaliacao" varchar NOT NULL,
            "id_usuario_aluno" varchar NOT NULL,
            "dt_inclusao" datetime DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY("id_usuario_avaliacao") REFERENCES "usuario"("id") 
              ON DELETE SET NULL 
              ON UPDATE CASCADE,
            FOREIGN KEY("id_usuario_aluno") REFERENCES "usuario"("id") 
              ON DELETE CASCADE 
              ON UPDATE CASCADE
          )
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "avaliacao_imc"`);
      }
    }