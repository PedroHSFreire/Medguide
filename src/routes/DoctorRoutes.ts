import { Router } from "express";
import { DoctorController } from "../controllers/DoctorController.js";
import {
  validateDoctor,
  validateDoctorUpdate,
  validateID,
  validateLogin,
  validateCPFParam,
  validateForgotPassword,
  validateResetPassword,
} from "../middleware/validation.js";
// import { authenticate } from "../middleware/auth.js";

const router = Router();

// ROTAS PÚBLICAS
router.post("/register", validateDoctor, DoctorController.register);
router.post("/login", validateLogin, DoctorController.login);
router.post(
  "/forgot-password",
  validateForgotPassword,
  DoctorController.forgotPassword
);
router.post(
  "/reset-password",
  validateResetPassword,
  DoctorController.resetPassword
);

// ROTAS AUTENTICADAS
router.get("/profile", DoctorController.getProfile);
router.put("/profile", validateDoctorUpdate, DoctorController.updateProfile);

// ROTAS ADM
router.get("/:id", validateID, DoctorController.findById);
router.get("/cpf/:cpf", validateCPFParam, DoctorController.findByCPF);
router.put("/:id", validateID, validateDoctorUpdate, DoctorController.update);
router.delete("/:id", validateID, DoctorController.delete);

export default router;
