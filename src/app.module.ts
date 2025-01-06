import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagingController } from './messaging/messaging.controller';
import { MessagingService } from './messaging/messaging.service';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [MessagingModule],
  controllers: [AppController, MessagingController],
  providers: [AppService, MessagingService],
})
export class AppModule {}
