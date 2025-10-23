import { Router } from "express";
import PacientRoutes from "./PacientRoutes.js";
import DoctorRoutes from "./DoctorRoutes.js";
import { Response, Request } from "express";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Api funciando corretamente",
    timestamp: new Date().toISOString(),
  });
});

router.use("/doctor", DoctorRoutes);
router.use("/pacient", PacientRoutes);
export default router;
