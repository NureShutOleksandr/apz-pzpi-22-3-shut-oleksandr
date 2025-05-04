import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, Types } from 'mongoose'

export type RoomDocument = HydratedDocument<Room>

@Schema({ timestamps: true })
export class Room {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId

  @Prop({ required: true })
  temperature: number

  @Prop({ required: true })
  moisture: number

  @Prop({ required: true })
  carbonDioxide: number

  @Prop({ required: true })
  illumination: number

  @Prop({
    type: [
      {
        temperature: { type: Number, required: true },
        moisture: { type: Number, required: true },
        carbonDioxide: { type: Number, required: true },
        illumination: { type: Number, required: true },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  historyChanges: {
    temperature: number
    moisture: number
    carbonDioxide: number
    illumination: number
    updatedAt: Date
  }[]
}

export const RoomSchema = SchemaFactory.createForClass(Room)
