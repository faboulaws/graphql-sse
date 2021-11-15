import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User {
    @Field(() => Int)
    id: number;

    @Field()
    username: string

    @Field()
    fullName: string;

    @Field()
    dateCreated: Date
}


@InputType()
export class CreateUserInput {   

    @Field()
    username: string

    @Field()
    fullName: string;
}

@ObjectType()
export class CreateUserPayload {
    @Field(() => User)
    user: User
}