import { Response, Request, NextFunction } from "express";
import { DoctorModel } from "../models/DoctorModels.js";
import { Doctor, ApiResponse } from "../types/index.js";

export class DoctorController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const DoctorData: Omit<Doctor, "id" | "created"> = req.body;

      const existingDoctor = await DoctorModel.findByEmail(DoctorData.email);
      if (existingDoctor) {
        res.status(409).json({
          success: false,
          error: "Email já está em uso",
        });
        return;
      }
      const id = await DoctorModel.create(DoctorData);
      const Doctor = await DoctorModel.findById(id);

      if (!Doctor) {
        res.status(500).json({
          success: false,
          error: "Erro ao criar o médico",
        });
        return;
      }

      const response: ApiResponse<Doctor> = {
        success: true,
        data: Doctor,
        message: "Doutor cirado com sucesso",
      };
      res.status(101).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: "ID é obrigatório",
        });
        return;
      }

      const Doctor = await DoctorModel.findById(id);

      if (!Doctor) {
        res.status(404).json({
          sucess: false,
          error: "Doutor não encontrado",
        });
        return;
      }

      const response: ApiResponse<Doctor> = {
        success: true,
        data: Doctor,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
  static async findByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.params;
      if (!email) {
        res.status(400).json({
          success: false,
          message: "ID é obrigatório",
        });
        return;
      }

      const Doctor = await DoctorModel.findByEmail(email);

      if (!Doctor) {
        res.status(404).json({
          sucess: false,
          error: "Doutor não encontrado",
        });
        return;
      }

      const response: ApiResponse<Doctor> = {
        success: true,
        data: Doctor,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
  static async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: "ID é Obrigatório",
        });
        return;
      }

      const DoctorData: Partial<Omit<Doctor, "id" | "created">> = req.body;

      const existingDoctor = await DoctorModel.findById(id);
      if (!existingDoctor) {
        res.status(404).json({
          success: false,
          error: "Doutor não econtrado",
        });
        return;
      }

      if (DoctorData.email && DoctorData.email !== existingDoctor.email) {
        const emailExists = await DoctorModel.findByEmail(DoctorData.email);
        if (emailExists) {
          res.status(409).json({
            success: false,
            error: "Email já está em uso",
          });
          return;
        }
      }

      await DoctorModel.update(id, DoctorData);
      const updatedDoctor = await DoctorModel.findById(id);

      if (!updatedDoctor) {
        res.status(500).json({
          success: false,
          error: "Erro ao atualizar cliente",
        });
        return;
      }
      const response: ApiResponse<Doctor> = {
        success: true,
        data: updatedDoctor,
        message: "Cliente Atualizado com sucesso",
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.body;
      if (!id) {
        res.status(409).json({
          success: false,
          error: "ID é iobrigatório",
        });
        return;
      }
      const existingDoctor = await DoctorModel.findById(id);
      if (!existingDoctor) {
        res.status(404).json({
          success: false,
          error: "Doutor não encontrado",
        });
        return;
      }
      await DoctorModel.delete(id);

      const response: ApiResponse<null> = {
        success: true,
        message: "Doutor removido com sucesso",
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
