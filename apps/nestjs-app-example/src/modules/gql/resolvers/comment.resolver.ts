import { Args, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { CommentService } from '../services/comment.service';
import { PubSubService } from '../services/pub-sub.service';
import {Comment} from '../app.models';

@Resolver((of) => Comment)
export class CommentResolver {
  constructor(
    private pubSubService: PubSubService,
    private commentService: CommentService
  ) {}
  // ...
  @Subscription((returns) => Comment)
  commentAdded() {
    return this.pubSubService.pubSub.asyncIterator('commentAdded');
  }

  @Mutation(returns => Comment)
  createComment(
    @Args('authorId', {type: () => Int}) authorId: number,
    @Args('postId',  {type: () => Int}) postId: number,
    @Args('body') body: string
  ) {
    const newComment = this.commentService.addComment(authorId, postId, body);

    this.pubSubService.pubSub.publish('commentAdded', {
      commentAdded: newComment,
    });
    return newComment;
  }

  @Query(returns => [Comment])
  comments(@Args('authorId', {type: () => Int, nullable: true}) authorId: number,
  @Args('postId',  {type: () => Int, nullable: true}) postId: number){
    return this.commentService.getComments(postId, authorId)
  }
}
