import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath =
  process.env.DATABASE_PATH || join(__dirname, "../../database.sqlite");

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(" Erro ao conectar com o banco de dados:", err.message);
  } else {
    console.log(" Conectado ao banco de dados SQLite:", dbPath);

    createTables().catch((error) => {
      console.error(" Erro ao criar tabelas:", error);
    });
  }
});

async function createTables(): Promise<void> {
  const createDoctorTable = `
    CREATE TABLE IF NOT EXISTS Doctor (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      CRM INTEGER NOT NULL UNIQUE,
      specialty TEXT NOT NULL,
      password TEXT,  
      cpf TEXT, 
      created DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createPacientTable = `
    CREATE TABLE IF NOT EXISTS Pacient (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT,
      cpf TEXT,
      created DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    await runQuery(createDoctorTable);
    console.log("abela Doctor criada/verificada");

    await runQuery(createPacientTable);
    console.log("Tabela Pacient criada/verificada");
  } catch (error) {
    console.error("Erro ao criar tabelas:", error);
    throw error;
  }
}
async function addColumn(
  table: string,
  column: string,
  type: string
): Promise<void> {
  const sql = `ALTER TABLE ${table} ADD COLUMN ${column} ${type}`;
  try {
    await runQuery(sql);
    console.log(`Coluna ${column} adicionada na tabela ${table}`);
  } catch (error: any) {
    if (error.message.includes("duplicate column name")) {
      console.log(`Coluna ${column} já existe na tabela ${table}`);
    } else {
      throw error;
    }
  }
}

export const closeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        console.log("✅ Conexão com o banco fechada");
        resolve();
      }
    });
  });
};

export const runQuery = (
  sql: string,
  params: unknown[] = []
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        console.error(
          "Erro na query:",
          sql,
          "Params:",
          params,
          "Error:",
          err.message
        );
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const getQuery = <T>(
  sql: string,
  params: unknown[] = []
): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error(
          "Erro na query:",
          sql,
          "Params:",
          params,
          "Error:",
          err.message
        );
        reject(err);
      } else {
        resolve(row as T);
      }
    });
  });
};

export const allQuery = <T>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error(
          "Erro na query:",
          sql,
          "Params:",
          params,
          "Error:",
          err.message
        );
        reject(err);
      } else {
        resolve(rows as T[]);
      }
    });
  });
};
