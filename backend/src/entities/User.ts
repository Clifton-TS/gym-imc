import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export type UserRole = "admin" | "aluno" | "professor";
export type UserStatus = "ativo" | "inativo";

@Entity("usuario")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 60 })
  nome: string;

  @Column({ length: 60, unique: true })
  usuario: string;

  @Column({ length: 255 })
  senha: string;

  @Column({ type: "varchar", length: 20 })
  perfil: UserRole;

  @Column({ type: "varchar", length: 10 })
  situacao: UserStatus;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  dtInclusao: Date;
}
