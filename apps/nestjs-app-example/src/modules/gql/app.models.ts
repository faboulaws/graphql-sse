import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Time {
  @Field()
  value: string;
}


@ObjectType()
export class Post {
  @Field(() => Int)
  id: number;

  @Field()
  body: string
}

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  fullName: string;
}

@ObjectType()
export class Comment {
  @Field(() => Int)
  id: number;

  // @Field()
  // post?: Post;

  @Field(() => Int)
  postId: Post;

  // @Field()
  // author?: User;

  @Field(() => Int)
  authorId: number;
}

