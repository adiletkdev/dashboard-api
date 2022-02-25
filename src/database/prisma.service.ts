import { PrismaClient, UserModel } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { ILogger } from '../logger/logger.interface'
import { TYPES } from '../types'

@injectable()
export class PrismaService {
  client: PrismaClient

  constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
    this.client = new PrismaClient()
  }

  async connect(): Promise<void> {
    try {
      await this.client.$connect()
      this.loggerService.log('[PrismaService] Успешно подключились к базе данных')
    } catch (e) {
      if (e instanceof Error) {
        this.loggerService.error('[PrismaService] Ошибка подключения к базе данных: ' + e.message)
      }
    }
  }

  async disconnet(): Promise<void> {
    await this.client.$disconnect()
  }
}
