import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game, GameSchema } from './schemas/game.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    UsersModule,
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
