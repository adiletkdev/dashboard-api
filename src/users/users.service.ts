import { injectable } from 'inversify'
import { UserLoginDto } from './dto/users-login.dto'
import { UserRegisterDto } from './dto/users-register.dto'
import { User } from './user.entity'
import { IUserService } from './users.service.interface'

@injectable()
export class UserService implements IUserService {
  async createUser({ name, email, password }: UserRegisterDto): Promise<User | null> {
    const newUser = new User(email, name)
    await newUser.setPassword(password)
    return newUser
  }

  async validateUser(dto: UserLoginDto): Promise<boolean> {
    return true
  }
}
