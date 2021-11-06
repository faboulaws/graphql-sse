import { Injectable } from '@nestjs/common';

@Injectable()
export class InfoService {
  getData(): { message: string } {
    return { message: 'Welcome to nestjs-app-example!' };
  }
}
