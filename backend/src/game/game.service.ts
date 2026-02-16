import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument, GameStatus, Player } from './schemas/game.schema';
import { UsersService } from '../users/users.service';
import { MakeMoveDto } from './dto/make-move.dto';

type Board = (Player | null)[];

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    private usersService: UsersService,
  ) {}

  async createGame(userId: string): Promise<Game> {
    const newGame = new this.gameModel({
      playerId: userId,
      board: Array(9).fill(null),
      currentTurn: Player.X, // Player is always X
      status: GameStatus.IN_PROGRESS,
    });
    return newGame.save();
  }

  async makeMove(gameId: string, userId: string, makeMoveDto: MakeMoveDto): Promise<Game> {
    const game = await this.gameModel.findById(gameId);

    if (!game) {
      throw new BadRequestException('Game not found');
    }

    if (game.playerId !== userId) {
      throw new BadRequestException('Not your game');
    }

    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new BadRequestException('Game is already finished');
    }

    if (game.currentTurn !== Player.X) {
      throw new BadRequestException("It's not your turn");
    }

    const { position } = makeMoveDto;

    if (position < 0 || position > 8) {
      throw new BadRequestException('Invalid position');
    }

    if (game.board[position] !== null) {
      throw new BadRequestException('Position already taken');
    }

    // Player move
    game.board[position] = Player.X;

    // Check if player wins
    if (this.checkWinner(game.board, Player.X)) {
      game.status = GameStatus.PLAYER_WON;
      game.winner = Player.X;
      await this.usersService.updateScore(userId, true);
      const result = await this.gameModel.findByIdAndUpdate(gameId, game, { new: true }).exec();
      return result!;
    }

    // Check for draw
    if (this.isBoardFull(game.board)) {
      game.status = GameStatus.DRAW;
      const result = await this.gameModel.findByIdAndUpdate(gameId, game, { new: true }).exec();
      return result!;
    }

    // Bot move
    game.currentTurn = Player.O;
    const botMove = this.getBotMove(game.board);
    game.board[botMove] = Player.O;

    // Check if bot wins
    if (this.checkWinner(game.board, Player.O)) {
      game.status = GameStatus.BOT_WON;
      game.winner = Player.O;
      await this.usersService.updateScore(userId, false);
      const result = await this.gameModel.findByIdAndUpdate(gameId, game, { new: true }).exec();
      return result!;
    }

    // Check for draw after bot move
    if (this.isBoardFull(game.board)) {
      game.status = GameStatus.DRAW;
      const result = await this.gameModel.findByIdAndUpdate(gameId, game, { new: true }).exec();
      return result!;
    }

    // Continue game
    game.currentTurn = Player.X;
    const result = await this.gameModel.findByIdAndUpdate(gameId, game, { new: true }).exec();
    return result!;
  }

  async getGame(gameId: string): Promise<Game> {
    const game = await this.gameModel.findById(gameId);
    if (!game) {
      throw new BadRequestException('Game not found');
    }
    return game;
  }

  async getUserGames(userId: string): Promise<Game[]> {
    return this.gameModel.find({ playerId: userId }).sort({ createdAt: -1 }).limit(10).exec();
  }

  private checkWinner(board: Board, player: Player): boolean {
    const winPatterns = [
      [0, 1, 2], // Row 1
      [3, 4, 5], // Row 2
      [6, 7, 8], // Row 3
      [0, 3, 6], // Column 1
      [1, 4, 7], // Column 2
      [2, 5, 8], // Column 3
      [0, 4, 8], // Diagonal 1
      [2, 4, 6], // Diagonal 2
    ];

    return winPatterns.some((pattern) => pattern.every((index) => board[index] === player));
  }

  private isBoardFull(board: Board): boolean {
    return board.every((cell) => cell !== null);
  }

  private getBotMove(board: Board): number {
    // Simple AI: Try to win, block player, or take best available
    const emptySpots = board
      .map((cell, index) => (cell === null ? index : -1))
      .filter((index) => index !== -1);

    // Try to win
    for (const spot of emptySpots) {
      const testBoard = [...board];
      testBoard[spot] = Player.O;
      if (this.checkWinner(testBoard, Player.O)) {
        return spot;
      }
    }

    // Block player from winning
    for (const spot of emptySpots) {
      const testBoard = [...board];
      testBoard[spot] = Player.X;
      if (this.checkWinner(testBoard, Player.X)) {
        return spot;
      }
    }

    // Take center if available
    if (board[4] === null) {
      return 4;
    }

    // Take a corner
    const corners = [0, 2, 6, 8].filter((i) => board[i] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // Take any available spot
    return emptySpots[Math.floor(Math.random() * emptySpots.length)];
  }
}
