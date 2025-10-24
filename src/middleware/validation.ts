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

export const validatePacientUpdate = [
  body("name").optional().isLength({ min: 1, max: 255 }),
  body("email").optional().isEmail(),
  body("password").optional(),
  body("cpf").optional(),
  handleValidationErrors,
];

export const validateDoctorUpdate = [
  body("name").optional().isLength({ min: 1, max: 255 }),
  body("email").optional().isEmail(),
  body("CRM").optional().isInt(),
  body("specialty").optional(),
  body("password").optional(),
  body("cpf").optional(),
  handleValidationErrors,
];

export const validatePacient = [
  body("name").notEmpty().isLength({ min: 1, max: 255 }),
  body("email").isEmail(),
  body("password").notEmpty(),
  body("cpf").notEmpty(),
  handleValidationErrors,
];

export const validateDoctor = [
  body("name").notEmpty().isLength({ min: 1, max: 255 }),
  body("email").isEmail(),
  body("CRM").isInt(),
  body("specialty").notEmpty(),
  body("password").notEmpty(),
  body("cpf").notEmpty(),
  handleValidationErrors,
];

export const validateID = [
  param("id")
    .isLength({ min: 36, max: 36 })
    .withMessage("ID deve ter 36 caracteres"),
  handleValidationErrors,
];
