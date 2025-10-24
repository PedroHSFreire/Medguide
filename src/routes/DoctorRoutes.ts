import { Router } from "express";
import { DoctorController } from "../controllers/DoctorController.js";
import {
  validateDoctor,
  validateDoctorUpdate,
  validateID,
} from "../middleware/validation.js";

const router = Router();

router.post("/", validateDoctor, DoctorController.create);
router.get("/:id", validateID, DoctorController.findById);
router.put("/:id", validateID, validateDoctorUpdate, DoctorController.update);
router.delete("/:id", validateID, DoctorController.delete);

export default router;
