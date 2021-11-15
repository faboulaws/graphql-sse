import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Comment {
    @Field(() => Int)
    id: number;

    @Field(() => Int)
    postId: number;

    @Field(() => Int)
    authorId: number;

    @Field()
    body: string;

    @Field()
    dateCreated: Date
}

@InputType()
export class CreateCommentInput {
    @Field(() => Int)
    postId: number;

    @Field(() => Int)
    authorId: number;

    @Field()
    body: string;
}

@ObjectType()
export class CreateCommentPayload {
    @Field(() => Comment)
    comment: Comment
}