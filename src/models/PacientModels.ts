import { Pacient } from "../types/index.js";
import { runQuery, getQuery } from "../database/connection.js";
import { v4 as uuidv4 } from "uuid";

export class PacientModel {
  static async create(Pacient: Omit<Pacient, "id" | "created">) {
    const id = uuidv4();
    const sql = "INSERT INTO Pacient (id,name, email) VALUES (?,?,?)";
    await runQuery(sql, [id, Pacient.name, Pacient.email]);
    return id;
  }
  static async findByname(name: string): Promise<Pacient | undefined> {
    const sql = "SELECT * FROM Doctor WHERE name = ?";
    return await getQuery<Pacient>(sql, [name]);
  }
  static async findByEmail(email: string): Promise<Pacient | undefined> {
    const sql = "SELECT * FROM Doctor WHERE email = ?";
    return await getQuery<Pacient>(sql, [email]);
  }
}
