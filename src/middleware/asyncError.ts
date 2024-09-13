import { NextFunction, Request, Response } from "express";

export const CatchAsyncError =
	(asyncFunc: Function) =>
	(request: Request, response: Response, next: NextFunction) => {
		Promise.resolve(asyncFunc(request, response, next)).catch(next);
	};
