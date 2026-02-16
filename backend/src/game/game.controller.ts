import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GameService } from './game.service';
import { MakeMoveDto } from './dto/make-move.dto';
import { Request as ExpressRequest } from 'express';

@Controller('game')
@UseGuards(AuthGuard('jwt'))
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('new')
  async createGame(@Request() req: ExpressRequest) {
    return this.gameService.createGame((req as any).user._id.toString());
  }

  @Post(':id/move')
  async makeMove(@Param('id') id: string, @Request() req: ExpressRequest, @Body() makeMoveDto: MakeMoveDto) {
    return this.gameService.makeMove(id, (req as any).user._id.toString(), makeMoveDto);
  }

  @Get(':id')
  async getGame(@Param('id') id: string) {
    return this.gameService.getGame(id);
  }

  @Get('user/history')
  async getUserGames(@Request() req: ExpressRequest) {
    return this.gameService.getUserGames((req as any).user._id.toString());
  }
}
