import { Request, Response, NextFunction } from "express";
import { AppointmentModel } from "../models/AppointmentModel.js";
import {
  Appointment,
  CreateAppointmentDTO,
  ApiResponse,
} from "../types/index.js";

export class AppointmentController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const appointmentData: CreateAppointmentDTO = req.body;
      const id = await AppointmentModel.create(appointmentData);
      const newAppointment = await AppointmentModel.findById(id);
      if (!newAppointment) {
        res.status(500).json({
          success: false,
          error: "Erro ao recuperar consulta criada",
        });
        return;
      }
      const response: ApiResponse<Appointment> = {
        success: true,
        data: newAppointment,
        message: "Consulta agendada com sucesso",
      };
      res.status(201).json(response);
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
      const appointment = await AppointmentModel.findById(String(id));

      if (!appointment) {
        res.status(404).json({
          success: false,
          error: "Consulta não encontrada",
        });
        return;
      }

      const response: ApiResponse<Appointment> = {
        success: true,
        data: appointment,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findByPacientId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { pacientId } = req.params;
      if (!pacientId) {
        res.status(500).json({
          success: false,
          error: "Erro ao recuperar consulta criada",
        });
        return;
      }
      const appointments = await AppointmentModel.findByPacientId(pacientId);

      const response: ApiResponse<Appointment[]> = {
        success: true,
        data: appointments,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findByDoctorId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { doctorId } = req.params;
      if (!doctorId) {
        res.status(500).json({
          success: false,
          error: "Erro ao recuperar consulta criada",
        });
        return;
      }
      const appointments = await AppointmentModel.findByDoctorId(doctorId);

      const response: ApiResponse<Appointment[]> = {
        success: true,
        data: appointments,
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
      const appointmentData: Partial<Omit<Appointment, "id" | "created">> =
        req.body;

      await AppointmentModel.update(Number(id), appointmentData);
      const updatedAppointment = await AppointmentModel.findById(String(id));
      if (!updatedAppointment) {
        res.status(500).json({
          success: false,
          error: "Erro ao recuperar consulta",
        });
        return;
      }
      const response: ApiResponse<Appointment> = {
        success: true,
        data: updatedAppointment,
        message: "Consulta atualizada com sucesso",
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
      const { id } = req.params;
      await AppointmentModel.delete(Number(id));

      const response: ApiResponse<null> = {
        success: true,
        message: "Consulta removida com sucesso",
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
