import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostComment } from 'src/post_comment/post-comment.entity';
import { CommentController } from './comment.controller';
import { Comment } from './comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostComment,
      Comment,
    ])
  ],
  controllers: [
    CommentController
  ],
})
export class CommentModule {}