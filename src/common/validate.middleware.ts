import { NextFunction, Request, Response } from 'express'
import { IMiddleWare } from './middleware.interface'
import { ClassConstructor, plainToClass } from 'class-transformer'
import { validate } from 'class-validator'

export class ValidateMiddleware implements IMiddleWare {
  constructor(private classValidate: ClassConstructor<object>) {}

  async execute({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    const instance = plainToClass(this.classValidate, body)
    const errors = await validate(instance)
    if (errors.length) {
      res.status(422).send(errors)
    } else {
      next()
    }
  }
}
