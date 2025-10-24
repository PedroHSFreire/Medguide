import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import "./database/init.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor roda na porta: ${PORT}`);
});
