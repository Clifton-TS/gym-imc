import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("usuario_token")
export class UserToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  refreshToken: string;

  @Column({ type: "uuid" })
  idUsuario: string;

  @Column({ type: "datetime" })
  expiracaoToken: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  dtInclusao: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "idUsuario" })
  usuario: User;
}
