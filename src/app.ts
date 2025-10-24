import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API está funcionando! Acesse /api/health para ver o status",
    available_routes: {
      health: "GET /api/health",
      doctor: [
        "POST /api/doctor",
        "GET /api/doctor/:id",
        "PUT /api/doctor/:id",
        "DELETE /api/doctor/:id",
      ],
      pacient: [
        "POST /api/pacient",
        "GET /api/pacient/:id",
        "PUT /api/pacient/:id",
        "DELETE /api/pacient/:id",
      ],
    },
  });
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
