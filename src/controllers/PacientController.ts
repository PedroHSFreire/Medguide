import { Response, Request, NextFunction } from "express";
import { PacientModel } from "../models/PacientModels.js";
import { Pacient, ApiResponse } from "../types/index.js";

export class PacientController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const PacientData: Omit<Pacient, "id" | "created"> = req.body;

      const exisitngPacient = await PacientModel.findByEmail(PacientData.email);
      if (exisitngPacient) {
        res.status(409).json({
          success: false,
          error: "Email já está em uso",
        });
        return;
      }
      const existingPacientByCPF = await PacientModel.findByCPF(
        PacientData.cpf
      );
      if (existingPacientByCPF) {
        res.status(409).json({
          success: false,
          error: "CPF já está em uso",
        });
        return;
      }
      const id = await PacientModel.create(PacientData);
      const Pacient = await PacientModel.findById(id);

      if (!Pacient) {
        res.status(500).json({
          success: false,
          error: "Erro ao criar o médico",
        });
        return;
      }
      const response: ApiResponse<Pacient> = {
        success: true,
        data: Pacient,
        message: "Doutor criado com sucesso",
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
      const Pacient = await PacientModel.findById(id);

      if (!Pacient) {
        res.status(404).json({
          success: false,
          error: "Pacient não encontrado",
        });
        return;
      }
      const response: ApiResponse<Pacient> = {
        success: true,
        data: Pacient,
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
          message: "Email é obrigatório",
        });
        return;
      }
      const Pacient = await PacientModel.findByEmail(email);

      if (!Pacient) {
        res.status(404).json({
          success: false,
          error: "Paciente não encontrado",
        });
        return;
      }
      const response: ApiResponse<Pacient> = {
        success: true,
        data: Pacient,
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
          message: "ID é obrigatório",
        });
        return;
      }
      const PacientData: Partial<Omit<Pacient, "id" | "created">> = req.body;

      const exisitngPacient = await PacientModel.findById(id);
      if (!exisitngPacient) {
        res.status(404).json({
          success: false,
          message: "Pacient não encontrado",
        });
        return;
      }
      if (PacientData.email && PacientData.email !== exisitngPacient.email) {
        const emailExists = await PacientModel.findByEmail(PacientData.email);
        if (emailExists) {
          res.status(409).json({
            success: false,
            error: "Email já está em uso",
          });
          return;
        }
      }
      if (PacientData.cpf && PacientData.cpf !== exisitngPacient.cpf) {
        const cpfExists = await PacientModel.findByCPF(PacientData.cpf);
        if (cpfExists) {
          res.status(409).json({
            success: false,
            error: "CPF já está em uso",
          });
          return;
        }
      }
      await PacientModel.update(id, PacientData);
      const updatedPacient = await PacientModel.findById(id);

      if (!updatedPacient) {
        res.status(500).json({
          success: false,
          message: "Erro ao atualizar paciente",
        });
        return;
      }
      const response: ApiResponse<Pacient> = {
        success: true,
        data: updatedPacient,
        message: "Paciente atualizado com sucesso",
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
        res.status(404).json({
          success: false,
          message: "Paciente não encontrado",
        });
        return;
      }
      await PacientModel.delete(id);

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
