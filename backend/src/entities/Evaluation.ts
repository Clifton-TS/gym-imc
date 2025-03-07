import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("avaliacao_imc")
export class Evaluation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "decimal" })
  altura: number;

  @Column({ type: "decimal" })
  peso: number;

  @Column({ type: "decimal" })
  imc: number;

  @Column({ length: 30 })
  classificacao: string;

  @Column({ type: "uuid" })
  idUsuarioAvaliacao: string;

  @Column({ type: "uuid" })
  idUsuarioAluno: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  dtInclusao: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "idUsuarioAvaliacao" })
  usuarioAvaliacao: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "idUsuarioAluno" })
  usuarioAluno: User;
}
