import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(auth0Id: string, email: string, name: string) {
    let user = await this.usersService.findByAuth0Id(auth0Id);

    if (!user) {
      user = await this.usersService.create({
        auth0Id,
        email,
        name,
      });
    } else if (user.name === 'Anonymous' && name !== 'Anonymous') {
      // อัพเดทชื่อถ้าเดิมเป็น Anonymous
      user = await this.usersService.updateName((user as any)._id.toString(), name);
    }

    return user;
  }
}
