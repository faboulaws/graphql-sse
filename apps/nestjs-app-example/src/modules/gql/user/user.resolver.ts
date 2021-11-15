import { Args, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { EntityService } from '../services/entity.service';
import { InjectEntityService } from '../services/entity.service.decorator';
import { CreateUserInput, CreateUserPayload, User } from './user.model';


@Resolver((of) => User)
export class UserResolver {
    constructor(@InjectEntityService(User) private postService: EntityService<User>) { }
  @Mutation(returns => CreateUserPayload)
  createPost(@Args('input') postDto: CreateUserInput
  ): CreateUserPayload {
      const newUser = this.postService.create(postDto);

      return { user: newUser };
  }

  @Query(returns => [User])
  users(
  ): User[] {
      return this.postService.getEntities()
  }
}
