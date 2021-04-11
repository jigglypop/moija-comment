import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentModule } from './comment/comment.module';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { PostCommentModule } from './post_comment/post-comment.module';
import { ReCommentModule } from './recomment/recomment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        ormConfig
      ],
      expandVariables: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: process.env.NODE_ENV !== 'production'
        ? ormConfig : ormConfigProd
    }),
    PostCommentModule,
    CommentModule,
    ReCommentModule
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
