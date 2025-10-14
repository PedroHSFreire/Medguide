import { Doctor } from "../types/index.js";
import { runQuery, getQuery, allQuery } from "../database/connection.js";
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
  static async findById(id: string): Promise<Doctor | undefined> {
    const sql = "SELECT * FROM Doctor WHERE id = ?";
    return await getQuery<Doctor>(sql, [id]);
  }
  static async findByname(name: string): Promise<Doctor | undefined> {
    const sql = "SELECT * FROM Doctor WHERE name = ?";
    return await getQuery<Doctor>(sql, [name]);
  }
  static async findByEmail(email: string): Promise<Doctor | undefined> {
    const sql = "SELECT * FROM Doctor WHERE email = ?";
    return await getQuery<Doctor>(sql, [email]);
  }
  static async findByCRM(CRM: string): Promise<Doctor | undefined> {
    const sql = "SELECT * FROM Doctor WHERE CRM = ?";
    return await getQuery<Doctor>(sql, [CRM]);
  }
  static async findByspecialty(spacialty: string): Promise<Doctor | undefined> {
    const sql = "SELECT * FROM Doctor WHERE spacialty = ?";
    return await getQuery<Doctor>(sql, [spacialty]);
  }

  static async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<Doctor[]> {
    const offset = (page - 1) * limit;
    let sql = "SELECT * FROM Doctor";
    const params: unknown[] = [];

    if (search) {
      sql += " WHERE nome LIKE ? OR email LIKE ?";
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY created DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    return await allQuery<Doctor>(sql, params);
  }

  static async count(search?: string): Promise<number> {
    let sql = "SELECT COUNT(*) as total FROM Doctor";
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
    Doctor: Partial<Omit<Doctor, "id" | "created">>
  ): Promise<void> {
    const fields = Object.keys(Doctor)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(Doctor);

    const sql = `UPDATE Doctor SET ${fields} WHERE ID = ?`;
    await runQuery(sql, [...values, id]);
  }
  static async delete(id: string): Promise<void> {
    const sql = "DELETE FROM Doctor WHERE id = ?";
    await runQuery(sql, [id]);
  }
}
