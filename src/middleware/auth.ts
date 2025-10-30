// middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Interface para o payload do JWT
interface JwtPayload {
  id: string;
  email: string;
  type: "pacient" | "doctor";
  iat?: number;
  exp?: number;
}

// Extendendo a interface Request do Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        type: "pacient" | "doctor";
      };
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Obter o token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        error: "Token de acesso não fornecido",
      });
      return;
    }

    // Extrair o token (remover "Bearer ")
    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        success: false,
        error: "Token de acesso não fornecido",
      });
      return;
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "seu-segredo-secreto"
    ) as JwtPayload;

    // Adicionar informações do usuário à requisição
    req.user = {
      id: decoded.id,
      email: decoded.email,
      type: decoded.type,
    };

    next(); // Continuar para a próxima função/middleware
  } catch (error) {
    console.error("Erro na autenticação:", error);

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: "Token expirado",
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: "Token inválido",
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: "Erro na autenticação",
    });
  }
};

// Middleware opcional para verificar tipo específico de usuário
export const requirePacient = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.type !== "pacient") {
    res.status(403).json({
      success: false,
      error: "Acesso permitido apenas para pacientes",
    });
    return;
  }
  next();
};

export const requireDoctor = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.type !== "doctor") {
    res.status(403).json({
      success: false,
      error: "Acesso permitido apenas para médicos",
    });
    return;
  }
  next();
};
