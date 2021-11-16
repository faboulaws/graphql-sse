import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@ObjectType("Address")
@InputType("AddressInput")
export class Address {
  @Field()
  street: string;
  @Field()
  suite: string;
  @Field()
  city: string;
  @Field()
  zipcode: string;
}

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  username: string

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  address: Address;

  @Field()
  dateCreated: Date
}


@InputType()
export class CreateUserInput {

  @Field()
  username: string

  @Field()
  name?: string;

  @Field()
  email: string;

  @Field()
  address?: Address;
}

@ObjectType()
export class CreateUserPayload {
  @Field(() => User)
  user: User
}
