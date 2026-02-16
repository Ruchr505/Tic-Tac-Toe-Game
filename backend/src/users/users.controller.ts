import { Controller, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('leaderboard')
  @UseGuards(AuthGuard('jwt'))
  async getLeaderboard() {
    return this.usersService.getLeaderboard();
  }

  @Put('me/profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Request() req: any, @Body() body: { name?: string }) {
    // อัพเดทชื่อจาก frontend
    if (body.name && req.user?._id) {
      return this.usersService.updateName(req.user._id.toString(), body.name);
    }
    return req.user;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // Admin endpoint - returns all players' scores
  @Get('admin/scores')
  @UseGuards(AuthGuard('jwt'))
  async getAllScores() {
    return this.usersService.getAllScores();
  }
}
