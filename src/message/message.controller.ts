import { Controller, Get, Post, Body, Patch, Param, Delete, Sse, Inject } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {

  constructor(
    private readonly messageService: MessageService,
  ) {}


  @Sse('sse')
  sse() { // : Observable<MessageEvent>
    const p$ = new Observable(observer => {
      setTimeout(() => observer.next("observable!"), 1000)
    })
    p$.subscribe(res => console.log(res))

    setTimeout(() => {
      // 지금 요청을 했기 때문에 별도의 observer가 생성이 되기 때문에 바로 출력이 되지 않고 다시 1초를 더 기다린 뒤에 출력이 된다.
      p$.subscribe(res => console.log('abcccc'))  
    }, 2000)

    // return interval(1000).pipe(
    //   map((_) => ({ } as MessageEvent)),
    // );
    // this.messageService.test();
    return of({data: "create push!"})
  }



  @Post('test1')
  async test() {
    console.log(new Date('2024-05-10T16:30'))
    return await this.messageService.fcm(
      'fUa9fCRw7i08Cd2pdXCdVi:APA91bGFAivbk6Py6GNM44Vu7eVef08jxtTljhWx-YEMTYClfsRGnCuCPKpz9Bp7suBXkRqWDbX47y7VVwFgHy8ZsMFGD6V2rraVdIWQTFd00yxj5L2wCNB8HhcVkHztQ3RDsYoqIxUa',
      'Test 입니다',
      'test임 ㅋㅋ'
    );
  }

  @Post('test2')
  async test2() {
    // return await this.messageService.addCronJob(10);
  }
}
