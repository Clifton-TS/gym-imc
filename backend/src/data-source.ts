import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { UserToken } from "./entities/UserToken";
import { Evaluation } from "./entities/Evaluation";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  entities: [User, UserToken, Evaluation],
  synchronize: false,
  migrations: ["src/migrations/*.ts"],
  logging: true,
});