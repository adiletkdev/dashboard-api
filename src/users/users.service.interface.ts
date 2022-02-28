import { UserModel } from '@prisma/client'
import { UserLoginDto } from './dto/users-login.dto'
import { UserRegisterDto } from './dto/users-register.dto'

export interface IUserService {
  createUser: (dto: UserRegisterDto) => Promise<UserModel | null>
  validateUser: (dto: UserLoginDto) => Promise<boolean>
  getUserInfo: (email: string) => Promise<UserModel | null>
}
