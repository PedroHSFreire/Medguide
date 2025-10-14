import dotenv from "dotenv";
dotenv.config();

import "./database/connection.js";

const PORT = process.env.PORT || 3000;

import app from "./app.js";

app.listen(PORT, () => {
  console.log(`Servidor roda na porta: ${PORT}`);
});
