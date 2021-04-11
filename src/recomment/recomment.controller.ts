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
import { CommentDto } from "./recomment.dto";
import * as bcrypt from 'bcrypt'
import { ReComment } from "./recomment.entity";
import { Comment } from "src/comment/comment.entity";

@Controller('/recomments')
export class ReCommentController {
  constructor(
    @InjectRepository(ReComment)
    private readonly repository: Repository<ReComment>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ){}

  @Get(':id')
  async findOne(@Param('id') id) {
    const recomment = await this.repository.findOne(id)
    if (!recomment){
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND ,
        message: "대댓글이 없습니다."
      })
    }
    return recomment
  }

  @Post(':commentId')
  async create(@Param('commentId') commentId, @Body() input: CommentDto) {
    const salt = await bcrypt.genSalt()
    const hashed = await bcrypt.hash(input.password, salt)
    input.password = hashed
    input.created = new Date().toString()
    const comment = await this.commentRepository.findOne(commentId)
    return await this.repository.save({
      ...input,
      comment
    })
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() input: { password : string, content: string }) {
    const recomment = await this.repository.findOne(id);
    if (!recomment){
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND ,
        message: "대댓글이 없습니다."
      })
    }
    const isTrue = await bcrypt.compare(input.password, recomment.password)
    if (!isTrue){
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED ,
        message: "비밀번호가 맞지 않습니다."
      })
    }
    recomment.content = input.content
    return await this.repository.save(recomment)
  }

  @Delete(':id')
  async delete(@Param('id') id, @Body() input: { password : string }){
    const recomment = await this.repository.findOne(id)
    if (!recomment){
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND ,
        message: "대댓글이 없습니다."
      })
    }
    const isTrue = await bcrypt.compare(input.password, recomment.password)
    if (!isTrue){
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED ,
        message: "비밀번호가 맞지 않습니다."
      })
    }
    return await this.repository.remove(recomment)
  }
}