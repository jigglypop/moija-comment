import { IsDateString, Length } from "class-validator";

export class CommentDto {
    @Length(3, 255, { 
        message: "이름의 길이가 맞지 않습니다."
    })
    name: string;

    @Length(0, 1000, { 
        message: "댓글의 길이가 맞지 않습니다."
    })
    content: string;

    @Length(5, 255, { 
        message: "비밀번호의 길이가 맞지 않습니다."
    })
    password: string;

    @IsDateString()
    created: string;
}