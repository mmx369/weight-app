import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import ApiError from '../exceptions/api-error'

export default function (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors })
  }
  //@ts-ignore
  if (err.code === 11000) {
    return res
      .status(400)
      .json({ message: 'Already exists. Try another word.' })
  }
  return res.status(500).json({ message: 'Something went wrong.' })
}
