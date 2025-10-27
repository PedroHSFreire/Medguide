import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: "Dados inválidos",
      details: errors.array(),
    });
    return;
  }
  next();
};

// 🔐 NOVAS VALIDAÇÕES PARA AUTENTICAÇÃO
export const validateLogin = [
  body("login").notEmpty().withMessage("E-mail ou CPF é obrigatório"),
  body("password")
    .notEmpty()
    .withMessage("Senha é obrigatória")
    .isLength({ min: 6 })
    .withMessage("Senha deve ter pelo menos 6 caracteres"),
  handleValidationErrors,
];

export const validateForgotPassword = [
  body("email").isEmail().withMessage("E-mail é obrigatório e deve ser válido"),
  handleValidationErrors,
];

export const validateResetPassword = [
  body("token").notEmpty().withMessage("Token é obrigatório"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Nova senha deve ter pelo menos 6 caracteres"),
  handleValidationErrors,
];

export const validateCPFParam = [
  param("cpf")
    .notEmpty()
    .withMessage("CPF é obrigatório")
    .isLength({ min: 11, max: 14 })
    .withMessage("CPF deve ter entre 11 e 14 caracteres"),
  handleValidationErrors,
];

// 🎯 VALIDAÇÕES EXISTENTES (mantenha as que você já tem)
export const validatePacientUpdate = [
  body("name").optional().isLength({ min: 1, max: 255 }),
  body("email").optional().isEmail(),
  body("password").optional().isLength({ min: 6 }),
  body("cpf").optional(),
  handleValidationErrors,
];

export const validateDoctorUpdate = [
  body("name").optional().isLength({ min: 1, max: 255 }),
  body("email").optional().isEmail(),
  body("CRM").optional().isInt(),
  body("specialty").optional(),
  body("password").optional().isLength({ min: 6 }),
  body("cpf").optional(),
  handleValidationErrors,
];

export const validatePacient = [
  body("name").notEmpty().isLength({ min: 1, max: 255 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("cpf").notEmpty(),
  handleValidationErrors,
];

export const validateDoctor = [
  body("name").notEmpty().isLength({ min: 1, max: 255 }),
  body("email").isEmail(),
  body("CRM").isInt(),
  body("specialty").notEmpty(),
  body("password").isLength({ min: 6 }),
  body("cpf").notEmpty(),
  handleValidationErrors,
];

export const validateID = [
  param("id")
    .isLength({ min: 36, max: 36 })
    .withMessage("ID deve ter 36 caracteres"),
  handleValidationErrors,
];
