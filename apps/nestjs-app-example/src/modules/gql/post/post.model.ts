import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Comment } from "../comment/comment.model";

@ObjectType()
export class Post {
    @Field(() => Int)
    id: number;

    @Field()
    title: string

    @Field()
    body: string

    @Field(() => Int)
    authorId: number;

    @Field()
    dateCreated: Date

    @Field(() => [Comment])
    comments: Comment[]
}

@InputType()
export class CreatePostInput {  

    @Field(() => Int)
    authorId: number;

    @Field()
    title: string;

    @Field()
    body: string;
}

@ObjectType()
export class CreatePostPayload {
    @Field(() => Post)
    post: Post
}