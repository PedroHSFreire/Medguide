import { runQuery } from "./connection.js";

const createTable = async (): Promise<void> => {
  const CreateDoctorTable = `
    CREATE TABLE IF NOT EXISTS Doctor (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL
    email TEXT NOT NULL UNIQUE
    created DATETIME DEFAULT CURRENT_TIMESTAMP
    CRM NUMBER UNIQUE
    )
    `;
  const CreatePacientTable = `
    CREATE TABLE IF NOT EXISTS Doctor (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL
    email TEXT NOT NULL UNIQUE
    created DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `;
  try {
    await runQuery(CreateDoctorTable);
    await runQuery(CreatePacientTable);
    console.log("Tabelas criadas com sucesso");
  } catch (error) {
    console.log("Erro ao criar tabela");
    throw Error;
  }

  if (require.main === module) {
    createTable()
      .then(() => {
        process.exit(0);
      })
      .catch(() => {
        process.exit(1);
      });
  }
};

export { createTable };
