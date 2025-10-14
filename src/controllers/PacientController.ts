import { Response, Request, NextFunction } from "express";
import { DoctorModel } from "../models/DoctorModels.js";
import { Pacient, ApiResponse } from "../types/index.js";

export class PacientController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {}
  static async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {}
  static async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {}
  static async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {}
}
