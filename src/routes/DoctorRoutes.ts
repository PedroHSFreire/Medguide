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
import { authenticate, requireDoctor } from "../middleware/auth.js"; // ← Importar

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
router.get(
  "/profile",
  authenticate,
  requireDoctor,
  DoctorController.getProfile
);
router.put(
  "/profile",
  authenticate,
  requireDoctor,
  validateDoctorUpdate,
  DoctorController.updateProfile
);

// ROTAS ADM
router.get("/:id", authenticate, validateID, DoctorController.findById);
router.get(
  "/cpf/:cpf",
  authenticate,
  validateCPFParam,
  DoctorController.findByCPF
);
router.put(
  "/:id",
  authenticate,
  validateID,
  validateDoctorUpdate,
  DoctorController.update
);
router.delete("/:id", authenticate, validateID, DoctorController.delete);

export default router;
