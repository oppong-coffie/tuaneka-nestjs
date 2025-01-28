import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ItemDocument = Item & Document;

@Schema({ collection: 'items', timestamps: true })
export class Item {
    @Prop({ required: true })
    item_name: string;

    @Prop()
    description: string;

    @Prop({ required: true, default: 1 })
    quantity: number;

    @Prop({ required: true, default: 0 })
    price: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
