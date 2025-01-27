import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from './item.model';

@Injectable()
export class ItemService {
  constructor(@InjectModel('Item') private itemModel: Model<ItemDocument>) {}

  async createItem(itemData: any): Promise<ItemDocument> {
    const createdItem = new this.itemModel(itemData);
    return createdItem.save();
  }

  // Get all Items
  async findAll(): Promise<Item[]> {
    try {
      const res = await this.itemModel.find().exec();
      console.log('Fetched items:', res); // Log to see if data is being fetched
      return res;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }

// Send data to database (Create new item)
async sendItem(newItem: Item): Promise<Item> {
  try {
    const createdItem = new this.itemModel(newItem); // Create a new instance using the data
    const savedItem = await createdItem.save(); // Save it to the database
    console.log('Item saved successfully:', savedItem); // Log saved item
    return savedItem;
  } catch (error) {
    console.error('Error saving item:', error);
    throw error;
  }
}


}
