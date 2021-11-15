import { Args, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { PubSubService } from '../services/pub-sub.service';
import { Comment, CreateCommentInput, CreateCommentPayload } from './comment.model';

@Resolver((of) => Comment)
export class CommentResolver {
  constructor(
    private pubSubService: PubSubService,
    private commentService: CommentService
  ) { }
  // ...
  @Subscription((returns) => Comment)
  commentAdded() {
    return this.pubSubService.pubSub.asyncIterator('commentAdded');
  }

  @Mutation(returns => CreateCommentPayload)
  createComment(

    @Args('input') comment: CreateCommentInput
  ): CreateCommentPayload {
    const newComment = this.commentService.create(comment);

    this.pubSubService.pubSub.publish('commentAdded', {
      commentAdded: newComment,
    });
    return { comment: newComment };
  }

  @Query(returns => [Comment])
  comments(@Args('authorId', { type: () => Int, nullable: true }) authorId: number,
    @Args('postId', { type: () => Int, nullable: true }) postId: number) {
    return this.commentService.getEntities({ postId, authorId })
  }
}
