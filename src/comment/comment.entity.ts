import { PostComment } from "src/post_comment/post-comment.entity";
import { ReComment } from "src/recomment/recomment.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100
    })
    name: string;

    @Column()
    content: string;

    @Column()
    password: string;

    @Column()
    created: Date;

    @ManyToOne(() => PostComment, (post_comment) => post_comment.comments, {
        nullable: false
    })
    @JoinColumn({
        name: 'post_id'
    })
    post: PostComment

    @OneToMany(() => ReComment, (recomment) => recomment.comment)
    recomments: ReComment[]
}