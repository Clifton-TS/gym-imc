import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export type UserRole = "admin" | "aluno" | "professor";
export type UserStatus = "ativo" | "inativo";

@Entity("usuario")
export class User {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ length: 60, name: "nome" })
  nome: string;

  @Column({ length: 60, unique: true, name: "usuario" })
  usuario: string;

  @Column({ length: 255, name: "senha" })
  senha: string;

  @Column({ type: "varchar", length: 20, name: "perfil" })
  perfil: UserRole;

  @Column({ type: "varchar", length: 10, name: "situacao" })
  situacao: UserStatus;

  @Column({ type: "datetime", name: "dt_inclusao", default: () => "CURRENT_TIMESTAMP" })
  dtInclusao: Date;
}
