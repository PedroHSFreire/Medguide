import { Router } from "express";
import { PacientController } from "../controllers/PacientController.js";
import {
  validatePacient,
  validatePacientUpdate,
  validateID,
  validateLogin,
  validateCPFParam,
  validateForgotPassword,
  validateResetPassword,
} from "../middleware/validation.js";
// import { authenticate } from "../middleware/auth.js"; // Você vai precisar criar este middleware

const router = Router();

// 🔐 ROTAS PÚBLICAS (sem autenticação)
router.post("/register", validatePacient, PacientController.register);
router.post("/login", validateLogin, PacientController.login);
router.post(
  "/forgot-password",
  validateForgotPassword,
  PacientController.forgotPassword
);
router.post(
  "/reset-password",
  validateResetPassword,
  PacientController.resetPassword
);

// ROTAS AUTENTICADAS
router.get("/profile", /* authenticate, */ PacientController.getProfile);
router.put(
  "/profile",
  /* authenticate, */ validatePacientUpdate,
  PacientController.updateProfile
);

// ROTAS ADM
router.get("/", PacientController.findById); // Para listar todos? Você precisará criar este método
router.get("/:id", validateID, PacientController.findById);
router.get("/cpf/:cpf", validateCPFParam, PacientController.findByCPF);
router.put("/:id", validateID, validatePacientUpdate, PacientController.update);
router.delete("/:id", validateID, PacientController.delete);

export default router;
