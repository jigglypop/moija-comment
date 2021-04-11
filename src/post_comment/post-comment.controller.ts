import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostComment } from "./post-comment.entity";

export interface IPostComment {
  id : string;
  postId: string;
}

@Controller('/postcomment')
export class PostCommentController {
  constructor(
    @InjectRepository(PostComment)
    private readonly repository: Repository<PostComment>
  ){}

  @Post()
  async create(@Body() input: { postId: string }) {
    const _input : IPostComment = {
      id : input.postId,
      postId: input.postId
    }
    return await this.repository.save(_input)
  }

  @Get(':id')
  async findOne(@Param('id') id) {
    const postcomment = await this.repository.findOne(id, { relations: ["comments", "comments.recomments"] })
    if (!postcomment){
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND ,
        message: "댓글 테이블이 없습니다."
      })
    }
    return postcomment
  }

  @Delete(':id')
  async delete(@Param('id') id){
    const post_comment = await this.repository.findOne(id)
    if (!post_comment){
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND ,
        message: "포스트가 없습니다."
      })
    }
    return await this.repository.remove(post_comment)
  }
}