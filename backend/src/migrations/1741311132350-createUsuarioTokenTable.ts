import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsuarioTokenTable1741311132350 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE "usuario_token" (
            "id" varchar PRIMARY KEY NOT NULL,
            "refresh_token" varchar(255) NOT NULL,
            "id_usuario" varchar NOT NULL,
            "expiracao_token" datetime NOT NULL,
            "dt_inclusao" datetime DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY("id_usuario") REFERENCES "usuario"("id") 
              ON DELETE CASCADE 
              ON UPDATE CASCADE
          )
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "usuario_token"`);
      }
    }
    