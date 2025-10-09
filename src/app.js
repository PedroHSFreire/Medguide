import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
const app = express();
app.use(morgan("tiny"));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use((req, res, next) => {
    res.send("Hello World");
});
app.use((error, req, res, next) => {
    res.status(500).send(error.message);
});
export default app;
//# sourceMappingURL=app.js.map