import { Pacient } from "../types/index.js";
import { runQuery, getQuery, allQuery } from "../database/connection.js";
import { v4 as uuidv4 } from "uuid";

export class PacientModel {
  static async create(
    pacient: Omit<Pacient, "id" | "created">
  ): Promise<string> {
    try {
      const id = uuidv4();
      const sql =
        "INSERT INTO Pacient (id, name, email, passowrd, cpf) VALUES (?, ?, ?,?,?)";
      await runQuery(sql, [id, pacient.name, pacient.email]);
      return id;
    } catch (error) {
      throw new Error(
        `Erro ao criar paciente: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async findByName(name: string): Promise<Pacient | undefined> {
    // Corrigido: findByName
    try {
      const sql = "SELECT * FROM Pacient WHERE name = ?";
      return await getQuery<Pacient>(sql, [name]);
    } catch (error) {
      throw new Error(
        `Erro ao buscar paciente por nome: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async findByEmail(email: string): Promise<Pacient | undefined> {
    try {
      const sql = "SELECT * FROM Pacient WHERE email = ?";
      return await getQuery<Pacient>(sql, [email]);
    } catch (error) {
      throw new Error(
        `Erro ao buscar paciente por email: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }
  static async findByCPF(cpf: string): Promise<Pacient | undefined> {
    try {
      const sql = "SELECT * FROM Pcient WHERE cpf = ?";
      return await getQuery<Pacient>(sql, [cpf]);
    } catch (error) {
      throw new Error(
        `Erro ao buscar paciente pelo cpf: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async findById(id: string): Promise<Pacient | undefined> {
    // Corrigido: string (minúsculo)
    try {
      const sql = "SELECT * FROM Pacient WHERE id = ?"; // Corrigido: use a variável sql
      return await getQuery<Pacient>(sql, [id]);
    } catch (error) {
      throw new Error(
        `Erro ao buscar paciente por ID: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<Pacient[]> {
    try {
      const offset = (page - 1) * limit;
      let sql = "SELECT * FROM Pacient";
      const params: any[] = [];

      if (search) {
        sql += " WHERE name LIKE ? OR email LIKE ?";
        params.push(`%${search}%`, `%${search}%`);
      }

      sql += " ORDER BY created DESC LIMIT ? OFFSET ?";
      params.push(limit, offset);

      return await allQuery<Pacient>(sql, params);
    } catch (error) {
      throw new Error(
        `Erro ao buscar pacientes: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async count(search?: string): Promise<number> {
    try {
      let sql = "SELECT COUNT(*) as total FROM Pacient";
      const params: any[] = [];

      if (search) {
        sql += " WHERE name LIKE ? OR email LIKE ?"; // Corrigido: espaço antes do WHERE
        params.push(`%${search}%`, `%${search}%`);
      }

      const result = await getQuery<{ total: number }>(sql, params);
      return result?.total || 0;
    } catch (error) {
      throw new Error(
        `Erro ao contar pacientes: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async update(
    id: string,
    pacient: Partial<Omit<Pacient, "id" | "created">>
  ): Promise<boolean> {
    try {
      const fields = Object.keys(pacient)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = Object.values(pacient);

      if (fields.length === 0) {
        throw new Error("Nenhum campo fornecido para atualização");
      }

      const sql = `UPDATE Pacient SET ${fields} WHERE id = ?`;
      await runQuery(sql, [...values, id]);
      return true;
    } catch (error) {
      throw new Error(
        `Erro ao atualizar paciente: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const sql = "DELETE FROM Pacient WHERE id = ?";
      await runQuery(sql, [id]);
      return true;
    } catch (error) {
      throw new Error(
        `Erro ao deletar paciente: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }
}
