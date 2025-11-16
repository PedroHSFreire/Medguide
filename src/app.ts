import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(helmet());
const corsOptions = {
  origin: function (origin: string | undefined, callback: any) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:8080, https://medguide-y0j4.onrender.com",
    ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};
app.use(cors(corsOptions));
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
