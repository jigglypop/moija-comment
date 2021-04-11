import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/comment/comment.entity';
import { ReCommentController } from './recomment.controller';
import { ReComment } from './recomment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comment,
      ReComment,
    ])
  ],
  controllers: [
    ReCommentController
  ],
})
export class ReCommentModule {}