import { Comment } from "src/comment/comment.entity";
import { Column, Entity, OneToMany, PrimaryColumn  } from "typeorm";

@Entity()
export class PostComment {
    @PrimaryColumn()
    id: string;

    @Column()
    postId: string;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[]
}