import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsuarioTokenTable1741311132350 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          CREATE TABLE "usuario_token" (
            "id" varchar PRIMARY KEY NOT NULL,
            "refreshToken" varchar(255) NOT NULL,
            "idUsuario" varchar NOT NULL,
            "expiracaoToken" datetime NOT NULL,
            "dtInclusao" datetime DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY("idUsuario") REFERENCES "usuario"("id") 
              ON DELETE CASCADE 
              ON UPDATE CASCADE
          )
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "usuario_token"`);
      }
    }
    