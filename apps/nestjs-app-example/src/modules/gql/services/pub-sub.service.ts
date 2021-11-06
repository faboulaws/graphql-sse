import { PubSub } from 'graphql-subscriptions';
import {Injectable} from '@nestjs/common'


@Injectable()
export class PubSubService {
  private _pubSub;

  constructor() {
    this._pubSub = new PubSub();
  }

  get pubSub() {
    return this._pubSub;
  }
}
