import { Doctor } from "../types/index.js";
import { runQuery, getQuery } from "../database/connection.js";
import { v4 as uuidv4 } from "uuid";

export class DoctorModel {
  static async create(Doctor: Omit<Doctor, "id" | "created">) {
    const id = uuidv4();
    const sql =
      "INSERT INTO Doctor (id,name, email,CRM,spacialty) VALUES (?,?,?,?,?)";
    await runQuery(sql, [
      id,
      Doctor.name,
      Doctor.email,
      Doctor.CRM,
      Doctor.spacialty,
    ]);

    return id;
  }
  static async findByname(name: string): Promise<Doctor | undefined> {
    const sql = "SELECT * FROM Doctor WHERE name = ?";
    return await getQuery<Doctor>(sql, [name]);
  }
  static async findByspecialty(spacialty: string): Promise<Doctor | undefined> {
    const sql = "SELECT * FROM Doctor WHERE spacialty = ?";
    return await getQuery<Doctor>(sql, [spacialty]);
  }
}
