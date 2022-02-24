import { UserLoginDto } from './dto/users-login.dto'
import { UserRegisterDto } from './dto/users-register.dto'
import { User } from './user.entity'

export interface IUserService {
  createUser: (dto: UserRegisterDto) => Promise<User | null>
  validateUser: (dto: UserLoginDto) => Promise<boolean>
}
