import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  Query,
  Options 
} from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';

interface ClientConnection {
  userId: string;
  response: Response;
}

@Controller('messaging')
export class MessagingController {
  
  private activeClients: ClientConnection[] = []; // Store active client connections
// Handle CORS preflight request
@Options('send')
options(@Res() res: Response) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.send();
}

  // Webhook to receive messages from Botpress
  @Post('webhook')
  async handleWebhook(
    @Body() payload: any,
    @Res() res: Response
  ): Promise<void> {
    try {
      console.log('Webhook received:', JSON.stringify(payload, null, 2));

      // Process the payload or forward it to the client as needed
      const { userId } = payload;

      // Find the client connection to send the message
      const clientConnection = this.activeClients.find(
        (conn) => conn.userId === userId
      );

      if (clientConnection) {
        clientConnection.response.json(payload);  // Forward Botpress response to the client
        this.activeClients = this.activeClients.filter(
          (conn) => conn !== clientConnection
        );
      }

      res.status(HttpStatus.OK).json({ status: 'success' });
    } catch (error) {
      console.error('Error handling webhook:', error.message);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: 'error', message: error.message });
    }
  }

  // Endpoint for clients to wait for messages
  @Get('listen')
  async listenForMessages(
    @Query('userId') userId: string,  // Use @Query instead of @Body for query parameters
    @Res() res: Response,
  ): Promise<void> {
    try {
      console.log(`Client connected to listen for messages, userId: ${userId}`);
      
      // Store the client's connection
      this.activeClients.push({ userId, response: res });
      
      // Keep the connection open until a message is received or timeout occurs
      res.setTimeout(30000, () => {
        console.log(`Connection timed out for userId: ${userId}`);
        this.activeClients = this.activeClients.filter(
          (conn) => conn.userId !== userId || conn.response !== res
        );
        res.status(HttpStatus.REQUEST_TIMEOUT).json({ message: 'No message received within timeout.' });
      });
    } catch (error) {
      console.error('Error handling client connection:', error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: 'error', message: error.message });
    }
  }
  

  // Send message to Botpress and forward the response to the client
  @Post('send')
  
  async sendToBotpress(
    @Body() payload: any, // Expects { "text": "Erica" }
    @Res() res: Response,
  ): Promise<void> {
    const botpressWebhookUrl =
      'https://webhook.botpress.cloud/242c8581-251c-4bff-b379-68447a91722f';
    const bearerToken = 'bp_pat_jA08dA8rYpvh5y8KfLCzLT5U7yGKGkC7FG7e';  // Your Bearer token
  
    try {
      const messageText = payload.text || '';  // Extract text, default to empty string if not provided
  
      console.log('Sending message to Botpress:', JSON.stringify(payload, null, 2));
  
      // Initiate listening for the client
      const userId = 'remoteUserId';  // Replace with dynamic userId if necessary
      await this.listenForMessages(userId, res); // Pass userId as string, not as an object
  
      // Send the message to Botpress
      const response = await axios.post(
        botpressWebhookUrl,
        {
          "userId": userId,
          "messageId": "remoteMessageId",
          "conversationId": "remoteConversationId",
          "type": "text",
          "text": messageText,  // Use the extracted "Erica"
          "payload": {
            "foo": "bar",
            "user": {
              "userName": "Robert"
            }
          }
        },
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      console.log('Message sent to Botpress:', response.data);
  
      // Respond with success after the message is sent
      res.status(HttpStatus.OK).json({ status: 'success', data: response.data });
    } catch (error) {
      console.error('Error sending message to Botpress:', error.message);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: 'error', message: error.message });
    }
  }
  
}