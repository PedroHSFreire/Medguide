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
      CRM TEXT NOT NULL UNIQUE,
      specialty TEXT NOT NULL,
      password TEXT,  
      cpf TEXT, 
      created DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createDoctorAddress = `
  CREATE TABLE IF NOT EXISTS DoctorAddress(
    id TEXT PRIMARY KEY AUTOINCREMENT,
    cep TEXT NOT NULL,
    rua TEXT NOT NULL,
    number INTEGER NOT NULL,  
    bairro TEXT NOT NULL,
    fk_id TEXT NOT NULL,      
    FOREIGN KEY (fk_id) REFERENCES Doctor(id)
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

  const createPacientAddress = `
  CREATE TABLE IF NOT EXISTS PacientAddress(
    id TEXT PRIMARY KEY AUTOINCREMENT,
    cep TEXT NOT NULL,
    rua TEXT NOT NULL,
    number INTEGER NOT NULL,
    bairro TEXT NOT NULL,
    fk_id TEXT NOT NULL, 
    FOREIGN KEY (fk_id) REFERENCES Pacient (id)
  )
  `;

  const createAppointmentTable = `
  CREATE TABLE IF NOT EXISTS Appointment (
    id TEXT PRIMARY KEY,
    date_time DATETIME NOT NULL,           
    status TEXT NOT NULL DEFAULT 'agendada',
    type TEXT NOT NULL,                                    
    symptoms TEXT NOT NULL,
    diagnosis TEXT,
    prescription TEXT,
    doctor_notes TEXT,
    specialty TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    pacient_id TEXT NOT NULL,            
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES Doctor(id),
    FOREIGN KEY (pacient_id) REFERENCES Pacient(id)
  )`;

  try {
    await runQuery(createDoctorTable);
    console.log("✅ Tabela Doctor criada/verificada");
    await runQuery(createPacientTable);
    console.log("✅ Tabela Pacient criada/verificada");
    await runQuery(createPacientAddress);
    console.log("✅ Tabela de endereço do paciente criada com sucesso");
    await runQuery(createDoctorAddress);
    console.log("✅ Tabela de endereço do médico criada com sucesso");
    await runQuery(createAppointmentTable);
    console.log("✅ Tabela de appointment criada com sucesso");
  } catch (error) {
    console.error("Erro ao criar tabelas:", error);
    throw error;
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

// Atualizar runQuery para retornar lastID
export const runQuery = (
  sql: string,
  params: unknown[] = []
): Promise<{ lastID?: number; changes?: number }> => {
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
        resolve({
          lastID: this.lastID,
          changes: this.changes,
        });
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
