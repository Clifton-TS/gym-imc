import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("usuario_token")
export class UserToken {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id: string;

  @Column({ length: 255, name: "refresh_token" })
  refreshToken: string;

  @Column({ type: "uuid", name: "id_usuario" })
  idUsuario: string;

  @Column({ type: "datetime", name: "expiracao_token" })
  expiracaoToken: Date;

  @Column({ type: "datetime", name: "dt_inclusao", default: () => "CURRENT_TIMESTAMP" })
  dtInclusao: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "id_usuario" })
  usuario: User;
}
