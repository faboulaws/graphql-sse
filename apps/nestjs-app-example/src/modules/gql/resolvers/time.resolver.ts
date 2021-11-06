import { Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { Time } from "../app.models";

export const pubSub = new PubSub();


@Resolver((of) => Time)
export class TimeResolver {
  // ...
  @Subscription((returns) => Time)
  whatTimeNow() {
    return pubSub.asyncIterator('TIME_UPDATED');
  }
}