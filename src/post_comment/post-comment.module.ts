import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostCommentController } from './post-comment.controller';
import { PostComment } from './post-comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostComment,
    ])
  ],
  controllers: [
    PostCommentController
  ],
})
export class PostCommentModule {}