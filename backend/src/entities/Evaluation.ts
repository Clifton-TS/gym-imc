import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("avaliacao_imc")
export class Evaluation {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ type: "decimal", name: "altura" })
  altura: number;

  @Column({ type: "decimal", name: "peso" })
  peso: number;

  @Column({ type: "decimal", name: "imc" })
  imc: number;

  @Column({ length: 30, name: "classificacao" })
  classificacao: string;

  @Column({ type: "uuid", name: "id_usuario_avaliacao" })
  idUsuarioAvaliacao: string;

  @Column({ type: "uuid", name: "id_usuario_aluno" })
  idUsuarioAluno: string;

  @Column({ type: "datetime", name: "dt_inclusao", default: () => "CURRENT_TIMESTAMP" })
  dtInclusao: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "id_usuario_avaliacao" })
  usuarioAvaliacao: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "id_usuario_aluno" })
  usuarioAluno: User;
}
