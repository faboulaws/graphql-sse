import { Injectable } from '@nestjs/common';
import { EntityService } from '../services/entity.service';
import { Comment, CreateCommentInput } from "./comment.model";
import { population } from "../services/population";

@Injectable()
export class CommentService extends EntityService<Comment, CreateCommentInput>{
  entities = population.get(Comment);
}
