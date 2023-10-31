import { NextFunction, Request, Response } from "express";

export default function HttpExceptionCatcher(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  const defaultMessage = "Unknown error occurred";
  const statusCode = err.statusCode || 500;

  const errorMessage = err.message || defaultMessage;

  res.status(statusCode).json({ error: errorMessage });
}
