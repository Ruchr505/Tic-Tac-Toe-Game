import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByAuth0Id(auth0Id: string): Promise<User | null> {
    return this.userModel.findOne({ auth0Id }).exec();
  }

  async updateName(userId: string, name: string): Promise<User> {
    const result = await this.userModel.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    ).exec();
    return result!;
  }

  async updateScore(userId: string, won: boolean): Promise<User> {
    const user = await this.findById(userId);

    if (won) {
      user.score += 1;
      user.consecutiveWins += 1;

      // Bonus point for 3 consecutive wins
      if (user.consecutiveWins >= 3) {
        user.score += 1;
        user.consecutiveWins = 0; // Reset after bonus
      }
    } else {
      user.score = Math.max(0, user.score - 1); // Don't go below 0
      user.consecutiveWins = 0; // Reset on loss
    }

    user.gamesPlayed += 1;

    const result = await this.userModel.findByIdAndUpdate(userId, user, { new: true }).exec();
    return result!;
  }

  async getLeaderboard(limit = 10): Promise<User[]> {
    return this.userModel.find().sort({ score: -1 }).limit(limit).exec();
  }

  async getAllScores(): Promise<User[]> {
    return this.userModel
      .find()
      .select('name email score gamesPlayed consecutiveWins')
      .sort({ score: -1 })
      .exec();
  }
}
