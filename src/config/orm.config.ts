import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Comment } from 'src/comment/comment.entity';
import { PostComment } from 'src/post_comment/post-comment.entity';
import { ReComment } from 'src/recomment/recomment.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
      PostComment,
      Comment,
      ReComment
    ],
    synchronize: true
  })
);