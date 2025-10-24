import { Router } from "express";
import { PacientController } from "../controllers/PacientController.js";
import {
  validatePacient,
  validatePacientUpdate,
  validateID,
} from "../middleware/validation.js";

const router = Router();

router.post("/", validatePacient, PacientController.create);
router.get("/:id", validateID, PacientController.findById);
router.put("/:id", validateID, validatePacientUpdate, PacientController.update);
router.delete("/:id", validateID, PacientController.delete);

export default router;
