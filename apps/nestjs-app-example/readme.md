# NestJS Example App
This example App demonstrates how to use GraphQL SSE with NestJS

## Running the App

```bash
nx run nestjs-app-example:serve
```

## Listening to subscriptions

Send a subscription query to `localhost:3333/graphql-subscription`

```graphql
subscription commentAdded {
    commentAdded {
        id
        authorId
    }
}
```

Create a comment by sending a mutation to `localhost:3333/graphql`

```graphql
mutation createComment{
  createComment(authorId: 1, postId: 1, body: "Nice") {
    id
  }
}
```




