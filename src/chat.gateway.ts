import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8080, { cors: true })
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  // A client asks to join a room
  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() data: { name: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);                                         // put this client in the room
    this.server.to(data.room).emit('chat', `${data.name} joined ${data.room}`); // tell only that room
  }

  // A client sends a message to their room
  @SubscribeMessage('chat')
  handleChat(@MessageBody() data: { room: string; msg: string }) {
    this.server.to(data.room).emit('chat', data.msg);               // send only to that room
  }
}