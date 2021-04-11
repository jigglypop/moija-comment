import { Comment } from "src/comment/comment.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReComment {
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

    @ManyToOne(() => Comment, (comment) => comment.recomments, {
        nullable: false
    })
    @JoinColumn({
        name: 'comment_id'
    })
    comment: Comment
}