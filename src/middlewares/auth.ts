import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomerDoc } from "../models";
import { ErrorHandler } from "../utils";
import { ACCESS_TOKEN } from "../config";

declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  const authHeaderString = Array.isArray(authHeader)
    ? authHeader[0]
    : authHeader;

  if (!authHeaderString?.startsWith("Bearer ")) {
    return next(new ErrorHandler("Access Denied. No token provided.", 401));
  }

  const token = authHeaderString.split(" ")[1];

  if (!token) return next(new ErrorHandler("Access Denied. No token provided.", 401));

  const decoded = jwt.verify(
    token,
    ACCESS_TOKEN as string
  ) as JwtPayload;

  if (!decoded) {
    return next(new ErrorHandler("Invalid token", 403));
  }

  console.log("Decoded: ", decoded);
  

  req.user = decoded.id as string;
  next();
  
};