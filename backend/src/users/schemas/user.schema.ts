import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  auth0Id: string;

  @Prop({ required: false, default: '' })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: 0 })
  score: number;

  @Prop({ default: 0 })
  gamesPlayed: number;

  @Prop({ default: 0 })
  consecutiveWins: number;

  @Prop({ default: false })
  isAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
