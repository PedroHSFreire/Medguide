import mysql from "mysql2";
import type { Connection } from "mysql2";
import dotenv from "dotenv";
dotenv.config();

export const db: Connection = mysql.createConnection({
  host: process.env.BD_HOST || "localhost",
  user: process.env.BD_USER || "root",
  password: process.env.BD_PASSWORD || "",
  database: process.env.BD_NAME || "medguide",
});

db.connect((err) => {
  if (err) {
    console.log("Erro ao conectar ao banco de dados: ", err.message);
  } else {
    console.log("Conexão com MySQL estabelecida!");
  }
});

export const runQuery = (
  sql: string,
  params: unknown[] = []
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, function (err) {
      if (err) {
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
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve((results as T[])[0]);
      }
    });
  });
};

export const allQuery = <T>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results as T[]);
      }
    });
  });
};
