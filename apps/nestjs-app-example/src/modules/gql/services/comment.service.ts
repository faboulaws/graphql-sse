import { Injectable } from '@nestjs/common';
import { cpuUsage } from 'process';

const comments = [];

@Injectable()
export class CommentService {
  addComment(authorId: number, postId: number, body: string) {
    const comment = { authorId, postId, body, id: comments.length + 1 };
    comments.push(comment);
    return comment;
  }

  getComments(postId: number, authorId: number) {
      let commentsBy = [...comments];
      if(!!postId) commentsBy = commentsBy.filter(comment => postId = comment.postId)
      if(!!authorId) commentsBy = commentsBy.filter(comment => authorId = comment.authorId)
      return commentsBy;
  }
}
