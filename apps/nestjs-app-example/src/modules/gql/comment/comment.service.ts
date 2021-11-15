import { Injectable } from '@nestjs/common';
import { EntityService } from '../services/entity.service';

@Injectable()
export class CommentService extends EntityService<Comment>{
  
}
