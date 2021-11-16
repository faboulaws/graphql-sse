import { Injectable } from '@nestjs/common';
import { EntityService } from '../services/entity.service';
import { CreateUserInput, User } from "./user.model";
import { population } from "../services/population";

@Injectable()
export class UserService extends EntityService<User, CreateUserInput>{
  entities = population.get(User);
}
