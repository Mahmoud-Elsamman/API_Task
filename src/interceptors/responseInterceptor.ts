import { NextFunction, Request, Response } from "express";

export default function responseInterceptor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const originalJson = res.json;

  res.json = (body: any): Response<any, Record<string, any>> => {
    res.locals.body = body;

    const modifiedData = {
      data: body,
      page: {
        url: req.baseUrl,
      },
    };

    originalJson.call(res, modifiedData);

    return res;
  };

  next();
}
