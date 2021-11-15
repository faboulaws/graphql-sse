import { Resolver, Args, Mutation, Query, Int, ResolveField, Parent } from "@nestjs/graphql";
import { EntityService } from "../services/entity.service";
import { InjectEntityService } from "../services/entity.service.decorator";
import { CreatePostInput, CreatePostPayload, Post } from "./post.model";
import { Comment } from "../comment/comment.model";
import { CommentService } from "../comment/comment.service";

@Resolver((of) => Post)
export class PostResolver {
    constructor(@InjectEntityService(Post) private postService: EntityService<Post>,
    private commentService: CommentService
    ) { }

    @Mutation(returns => CreatePostPayload)
    createPost(@Args('input') postDto: CreatePostInput
    ): CreatePostPayload {
        const newPost = this.postService.create(postDto);

        return { post: newPost };
    }

    @Query(returns => [Post])
    posts(@Args('authorId', { type: () => Int, nullable: true }) authorId: number
    ) {
        return this.postService.getEntities({ authorId })
    }

    @ResolveField()
    comments(@Parent() { id: postId }: Post) {
        return this.commentService.getEntities({ postId })
    }
}
