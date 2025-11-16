import { Response, Request, NextFunction } from "express";
import { PacientModel } from "../models/PacientModels.js";
import { Pacient, ApiResponse } from "../types/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class PacientController {
  //MÉTODOS DE AUTENTICAÇÃO
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { login, password } = req.body;

      console.log("🔐 Tentativa de login:", {
        login,
        passwordLength: password?.length,
      });

      // Buscar paciente por email ou CPF
      let pacient: Pacient | null = null;

      if (login.includes("@")) {
        console.log("📧 Buscando por email:", login);
        const result = await PacientModel.findByEmail(login);
        pacient = result ? result : null;
      } else {
        const cleanCPF = login.replace(/\D/g, "");
        console.log("🔢 Buscando por CPF:", cleanCPF);
        const result = await PacientModel.findByCPF(cleanCPF);
        pacient = result ? result : null;
      }

      console.log("👤 Paciente encontrado:", pacient ? "Sim" : "Não");

      if (!pacient) {
        console.log("❌ Paciente não encontrado");
        res.status(401).json({
          success: false,
          error: "Credenciais inválidas",
        });
        return;
      }

      // Verificar senha
      console.log("🔑 Verificando senha...");
      const isPasswordValid = await bcrypt.compare(password, pacient.password);
      console.log("✅ Senha válida:", isPasswordValid);

      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: "Credenciais inválidas",
        });
        return;
      }
      // Gerar token JWT
      const token = jwt.sign(
        {
          id: pacient.id,
          email: pacient.email,
          type: "pacient",
        },
        process.env.JWT_SECRET || "seu-segredo-secreto",
        { expiresIn: "24h" }
      );

      // Remover senha da resposta
      const { password: _, ...pacientWithoutPassword } = pacient;

      const response: ApiResponse<{
        token: string;
        pacient: Omit<Pacient, "password">;
      }> = {
        success: true,
        data: {
          token,
          pacient: pacientWithoutPassword,
        },
        message: "Login realizado com sucesso",
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const PacientData: Omit<Pacient, "id" | "created"> = req.body;

      // Verificar se email já existe
      const existingPacientByEmail = await PacientModel.findByEmail(
        PacientData.email
      );
      if (existingPacientByEmail) {
        res.status(409).json({
          success: false,
          error: "Email já está em uso",
        });
        return;
      }

      // Verificar se CPF já existe
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

      // Criptografar senha antes de salvar
      const hashedPassword = await bcrypt.hash(PacientData.password, 10);
      const pacientDataWithHash = { ...PacientData, password: hashedPassword };

      const id = await PacientModel.create(pacientDataWithHash);
      const newPacient = await PacientModel.findById(id);

      if (!newPacient) {
        res.status(500).json({
          success: false,
          error: "Erro ao criar paciente",
        });
        return;
      }

      // Remover senha da resposta
      const { password: _, ...pacientWithoutPassword } = newPacient;

      const response: ApiResponse<Omit<Pacient, "password">> = {
        success: true,
        data: pacientWithoutPassword,
        message: "Paciente criado com sucesso",
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const pacientId = req.user?.id;

      if (!pacientId) {
        res.status(401).json({
          success: false,
          error: "Não autorizado",
        });
        return;
      }

      const pacient = await PacientModel.findById(pacientId);
      if (!pacient) {
        res.status(404).json({
          success: false,
          error: "Paciente não encontrado",
        });
        return;
      }

      const { password, ...pacientWithoutPassword } = pacient;

      const response: ApiResponse<Omit<Pacient, "password">> = {
        success: true,
        data: pacientWithoutPassword,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const pacientId = req.user?.id;

      if (!pacientId) {
        res.status(401).json({
          success: false,
          error: "Não autorizado",
        });
        return;
      }

      const PacientData: Partial<Omit<Pacient, "id" | "created">> = req.body;

      // Se estiver atualizando a senha, criptografar
      if (PacientData.password) {
        PacientData.password = await bcrypt.hash(PacientData.password, 10);
      }

      const existingPacient = await PacientModel.findById(pacientId);
      if (!existingPacient) {
        res.status(404).json({
          success: false,
          message: "Paciente não encontrado",
        });
        return;
      }

      // Verificar conflitos de email
      if (PacientData.email && PacientData.email !== existingPacient.email) {
        const emailExists = await PacientModel.findByEmail(PacientData.email);
        if (emailExists) {
          res.status(409).json({
            success: false,
            error: "Email já está em uso",
          });
          return;
        }
      }

      // Verificar conflitos de CPF
      if (PacientData.cpf && PacientData.cpf !== existingPacient.cpf) {
        const cpfExists = await PacientModel.findByCPF(PacientData.cpf);
        if (cpfExists) {
          res.status(409).json({
            success: false,
            error: "CPF já está em uso",
          });
          return;
        }
      }

      await PacientModel.update(pacientId, PacientData);
      const updatedPacient = await PacientModel.findById(pacientId);

      if (!updatedPacient) {
        res.status(500).json({
          success: false,
          message: "Erro ao atualizar paciente",
        });
        return;
      }

      const { password, ...pacientWithoutPassword } = updatedPacient;

      const response: ApiResponse<Omit<Pacient, "password">> = {
        success: true,
        data: pacientWithoutPassword,
        message: "Perfil atualizado com sucesso",
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      // Implementar lógica de recuperação de senha
      // Enviar email com token, etc.

      const response: ApiResponse<null> = {
        success: true,
        message: "Instruções para redefinição de senha enviadas para o e-mail",
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token, password } = req.body;

      // Implementar lógica de redefinição de senha
      // Verificar token e atualizar senha

      const response: ApiResponse<null> = {
        success: true,
        message: "Senha redefinida com sucesso",
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // 🛠️ MÉTODOS EXISTENTES (mantenha os que você já tem com pequenas melhorias)
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Agora use o register para criação
    this.register(req, res, next);
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
          error: "Paciente não encontrado",
        });
        return;
      }

      // Remover senha da resposta
      const { password, ...pacientWithoutPassword } = Pacient;

      const response: ApiResponse<Omit<Pacient, "password">> = {
        success: true,
        data: pacientWithoutPassword,
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

      // Remover senha da resposta
      const { password, ...pacientWithoutPassword } = Pacient;

      const response: ApiResponse<Omit<Pacient, "password">> = {
        success: true,
        data: pacientWithoutPassword,
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findByCPF(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { cpf } = req.params;
      if (!cpf) {
        res.status(400).json({
          success: false,
          message: "CPF é obrigatório",
        });
        return;
      }

      const cleanCPF = cpf.replace(/\D/g, "");
      const Pacient = await PacientModel.findByCPF(cleanCPF);

      if (!Pacient) {
        res.status(404).json({
          success: false,
          error: "Paciente não encontrado",
        });
        return;
      }

      // Remover senha da resposta
      const { password, ...pacientWithoutPassword } = Pacient;

      const response: ApiResponse<Omit<Pacient, "password">> = {
        success: true,
        data: pacientWithoutPassword,
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

      // Se estiver atualizando a senha, criptografar
      if (PacientData.password) {
        PacientData.password = await bcrypt.hash(PacientData.password, 10);
      }

      const existngPacient = await PacientModel.findById(id);
      if (!existngPacient) {
        res.status(404).json({
          success: false,
          message: "Paciente não encontrado",
        });
        return;
      }

      if (PacientData.email && PacientData.email !== existngPacient.email) {
        const emailExists = await PacientModel.findByEmail(PacientData.email);
        if (emailExists) {
          res.status(409).json({
            success: false,
            error: "Email já está em uso",
          });
          return;
        }
      }

      if (PacientData.cpf && PacientData.cpf !== existngPacient.cpf) {
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

      const { password, ...pacientWithoutPassword } = updatedPacient;

      const response: ApiResponse<Omit<Pacient, "password">> = {
        success: true,
        data: pacientWithoutPassword,
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
      const { id } = req.params; // Corrigido: usar params em vez de body

      if (!id) {
        res.status(400).json({
          success: false,
          message: "ID é obrigatório",
        });
        return;
      }

      const existingPacient = await PacientModel.findById(id);
      if (!existingPacient) {
        res.status(404).json({
          success: false,
          message: "Paciente não encontrado",
        });
        return;
      }

      await PacientModel.delete(id);

      const response: ApiResponse<null> = {
        success: true,
        message: "Paciente removido com sucesso",
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
