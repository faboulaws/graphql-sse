import { Query, Resolver } from "@nestjs/graphql";

@Resolver(of => String)
export class GreetingResolver {
  
  @Query(returns => String)
  async greeting() {
    return 'Hello World';
  }
  
}