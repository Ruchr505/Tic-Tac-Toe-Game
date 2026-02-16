import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

export enum Player {
  X = 'X',
  O = 'O',
}

export enum GameStatus {
  IN_PROGRESS = 'in_progress',
  PLAYER_WON = 'player_won',
  BOT_WON = 'bot_won',
  DRAW = 'draw',
}

@Schema({ timestamps: true })
export class Game {
  @Prop({ required: true })
  playerId: string;

  @Prop({ type: [String], default: Array(9).fill(null) })
  board: (Player | null)[];

  @Prop({ enum: Player, default: Player.X })
  currentTurn: Player;

  @Prop({ enum: GameStatus, default: GameStatus.IN_PROGRESS })
  status: GameStatus;

  @Prop({ enum: Player, required: false })
  winner?: Player;
}

export const GameSchema = SchemaFactory.createForClass(Game);
