import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Comment {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  postId: number;

  @Field(() => String)
  email: string;

  @Field()
  body: string;

  @Field()
  name: string;

  @Field()
  dateCreated: Date
}

@InputType()
export class CreateCommentInput {
  @Field(() => Int)
  postId: number;

  @Field(() => String)
  email: string;

  @Field()
  body: string;

  @Field()
  name: string;
}

@ObjectType()
export class CreateCommentPayload {
  @Field(() => Comment)
  comment: Comment
}
