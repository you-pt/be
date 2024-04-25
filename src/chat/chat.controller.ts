// import { Controller, Post, Get } from '@nestjs/common';
// import { ChatService } from './chat.service';
// import { CreateChatDto } from './dto/create-chat.dto';

// @Controller('chat')
// export class ChatController {
//   constructor(private readonly chatService: ChatService) {}

//   @Post('create')
//   async createChat(@Body() createChatDto: CreateChatDto) {
//     return this.chatService.create(createChatDto);
//   }

//   @Get('all')
//   async findAllMessages() {
//     return this.chatService.findAll();
//   }
// }
