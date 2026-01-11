import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

export enum userRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

export const auth = (...roles: userRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // get session
    
    try {
      console.log(req.headers)
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });
      // console.log(session);

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized",
        });
      }

      if (session.user.emailVerified === false) {
        return res.status(403).json({
          success: false,
          message: "You are not verified",
        });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified,
      };

      if (roles.length && !roles.includes(req.user?.role as userRole)) {
        return res.status(403).json({
          success: false,
          message: "You not allowed",
        });
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
};
