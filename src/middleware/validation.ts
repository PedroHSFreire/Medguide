import { body, param, query, validationResult } from "Express-validator";
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
      error: "Dados invalidos",
      detaisl: errors.array(),
    });
    return;
  }
  next();
};
export const validateDoctor = [
  body("name")
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ min: 1, max: 255 })
    .withMessage("Nome deve ter entre 1 e 255 caracteres"),
  body("email")
    .isEmail()
    .withMessage("Nome deve ter entre 1 e 255 caracteres")
    .normalizeEmail(),
  handleValidationErrors,
];
export const validatePacient = [
  body("name")
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ min: 1, max: 255 })
    .withMessage("Nome deve ter entre 1 e 255 caracteres"),
  body("email")
    .isEmail()
    .withMessage("Nome deve ter entre 1 e 255 caracteres")
    .normalizeEmail(),
  handleValidationErrors,
];
export const validateID = [
  param("id").isUUID(4).withMessage("ID deve ser um UUID válido"),
  handleValidationErrors,
];
