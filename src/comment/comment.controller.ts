import { 
  Body, 
  Controller, 
  Delete,
  Get, 
  HttpStatus, 
  NotFoundException, 
  Param, 
  Patch, 
  Post, 
  UnauthorizedException, 
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommentDto } from "./comment.dto";
import { Comment } from "./comment.entity";
import * as bcrypt from 'bcrypt'
import { PostComment } from "src/post_comment/post-comment.entity";

@Controller('/comments')
export class CommentController {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
    @InjectRepository(PostComment)
    private readonly postcommentRepository: Repository<PostComment>
  ){}

  @Get(':id')
  async findOne(@Param('id') id) {
    const comment = await this.repository.findOne(id, { relations: ["recomments"] })
    if (!comment){
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND ,
        message: "댓글이 없습니다."
      })
    }
    return comment
  }

  @Post(':postId')
  async create(@Param('postId') postId, @Body() input: CommentDto) {
    const salt = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(input.password, salt)
    input.password = hashed
    input.created = new Date().toString()
    const post = await this.postcommentRepository.findOne(postId)
    return await this.repository.save({
      ...input,
      post
    })
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() input: { password : string, content: string }) {
    const comment = await this.repository.findOne(id);
    if (!comment){
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND ,
        message: "댓글이 없습니다."
      })
    }
    const isTrue = await bcrypt.compare(input.password, comment.password)
    if (!isTrue){
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED ,
        message: "비밀번호가 맞지 않습니다."
      })
    }
    comment.content = input.content
    return await this.repository.save(comment)
  }

  @Delete(':id')
  async delete(@Param('id') id, @Body() input: { password : string }){
    const comment = await this.repository.findOne(id)
    if (!comment){
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND ,
        message: "댓글이 없습니다."
      })
    }
    const isTrue = await bcrypt.compare(input.password, comment.password)
    if (!isTrue){
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED ,
        message: "비밀번호가 맞지 않습니다."
      })
    }
    return await this.repository.remove(comment)
  }
}