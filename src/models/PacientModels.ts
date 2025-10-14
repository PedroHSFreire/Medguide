import { Pacient } from "../types/index.js";
import { runQuery, getQuery, allQuery } from "../database/connection.js";
import { v4 as uuidv4 } from "uuid";

export class PacientModel {
  static async create(Pacient: Omit<Pacient, "id" | "created">) {
    const id = uuidv4();
    const sql = "INSERT INTO Pacient (id,name, email) VALUES (?,?,?)";
    await runQuery(sql, [id, Pacient.name, Pacient.email]);
    return id;
  }
  static async findByname(name: string): Promise<Pacient | undefined> {
    const sql = "SELECT * FROM Pacient WHERE name = ?";
    return await getQuery<Pacient>(sql, [name]);
  }
  static async findByEmail(email: string): Promise<Pacient | undefined> {
    const sql = "SELECT * FROM Pacient WHERE email = ?";
    return await getQuery<Pacient>(sql, [email]);
  }
  static async findById(id: String): Promise<Pacient | undefined> {
    const sql = "SELECT * FROM Pacient WHERE id = ?";
    return await getQuery<Pacient>("sql", [id]);
  }
  static async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<Pacient[]> {
    const offset = (page - 1) * limit;
    let sql = "SELECT * FROM Pacient";
    const params: unknown[] = [];

    if (search) {
      sql += " WHERE nome LIKE ? OR email LIKE ?";
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY created DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    return await allQuery<Pacient>(sql, params);
  }

  static async count(search?: string): Promise<number> {
    let sql = "SELECT COUNT(*) as total FROM Pacient";
    const params: unknown[] = [];

    if (search) {
      sql += "WHERE nome LIKE ? OR email LIKE ?";
      params.push(`%${search}%`, `%${search}%`);
    }

    const result = await getQuery<{ total: number }>(sql, params);
    return result?.total || 0;
  }

  static async update(
    id: string,
    Pacient: Partial<Omit<Pacient, "id" | "created">>
  ): Promise<void> {
    const fields = Object.keys(Pacient)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(Pacient);

    const sql = `UPDATE Pacient SET ${fields} WHERE ID = ?`;
    await runQuery(sql, [...values, id]);
  }
  static async delete(id: string): Promise<void> {
    const sql = "DELETE FROM Pacient WHERE id = ?";
    await runQuery(sql, [id]);
  }
}
