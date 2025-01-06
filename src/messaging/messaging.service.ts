import { Injectable } from '@nestjs/common';
import { Message } from 'src/interfaces/messaging';

@Injectable()
export class MessagingService {
  private readonly messages: Message[] = [];

  create(response: any) {
    // Changed parameter type to 'any' for flexibility
    // Here you can add logic to process the response from Botpress
    const message: Message = {
      text: response.text || 'No text provided',
      sender: response.sender || 'unknown',
      conversationId: response.conversationId || 'defaultConversationId', // Added default value
      messagingId: response.messagingId || 'defaultMessagingId', // Added default value
      userId: response.userId || 'defaultUserId', // Added default value
      msgtype: response.msgtype || 'defaultMsgType', // Added default value
      payload: response.payload || {}, // Added default value
    } as Message; // Type assertion
    this.messages.push(message);
  }

  findAll(): Message[] {
    return this.messages;
  }

  private transformResponseToMessage(response: any): Message {
    // New method to transform response
    // Implement transformation logic based on the expected structure of the response
    return {
      // Assuming the Message interface has 'text', 'sender', 'conversationId', 'messagingId', 'userId', 'msgtype', and 'payload' properties
      text: response.text || 'No text provided',
      sender: response.sender || 'unknown',
      conversationId: response.conversationId || 'defaultConversationId', // Added default value
      messagingId: response.messagingId || 'defaultMessagingId', // Added default value
      userId: response.userId || 'defaultUserId', // Added default value
      msgtype: response.msgtype || 'defaultMsgType', // Added default value
      payload: response.payload || {}, // Added default value
    } as Message;
  }
}
