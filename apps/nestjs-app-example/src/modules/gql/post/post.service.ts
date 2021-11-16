import { Injectable } from '@nestjs/common';
import { EntityService } from '../services/entity.service';
import { CreatePostInput, Post } from "./post.model";
import { population } from "../services/population";

@Injectable()
export class PostService extends EntityService<Post, CreatePostInput>{
  entities = population.get(Post);
}
