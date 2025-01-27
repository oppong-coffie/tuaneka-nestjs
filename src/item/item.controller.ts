import { Body, Controller, Get, Post } from '@nestjs/common';
import { ItemService } from './item.service';
import { Item } from './item.model';

@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService) {}

    @Post()
    async createItem(@Body() itemDto: Item) {
      console.log('Received DTO:', itemDto);
      const result = await this.itemService.createItem(itemDto);
      console.log('Saved Item:', result);
      return result;
    }

    @Get()
    async getItem(): Promise<Item[]> {
      const items = await this.itemService.findAll();
      console.log('Items fetched from service:', items);
      return items;
    }

      // Send data to the database (Create a new item)
  @Post()
  async sendItem(@Body() newItem: Item): Promise<Item> {
    try {
      return await this.itemService.sendItem(newItem); // Call the service method to save the new item
    } catch (error) {
      throw error; // Error handling (could be improved)
    }
  }
}
