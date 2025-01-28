import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ItemSchema } from './item.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }])],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
