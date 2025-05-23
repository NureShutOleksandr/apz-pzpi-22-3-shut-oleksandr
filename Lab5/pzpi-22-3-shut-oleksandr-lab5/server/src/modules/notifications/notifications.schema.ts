import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, Types } from 'mongoose'

export type NotificationDocument = HydratedDocument<Notification>

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Notification', required: true })
  user: Types.ObjectId

  @Prop({ required: true })
  message: string
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)
