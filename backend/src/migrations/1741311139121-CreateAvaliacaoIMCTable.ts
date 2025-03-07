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
            "idUsuarioAvaliacao" varchar NOT NULL,
            "idUsuarioAluno" varchar NOT NULL,
            "dtInclusao" datetime DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY("idUsuarioAvaliacao") REFERENCES "usuario"("id") 
              ON DELETE SET NULL 
              ON UPDATE CASCADE,
            FOREIGN KEY("idUsuarioAluno") REFERENCES "usuario"("id") 
              ON DELETE CASCADE 
              ON UPDATE CASCADE
          )
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "avaliacao_imc"`);
      }
    }