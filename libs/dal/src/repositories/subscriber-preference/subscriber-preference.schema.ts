import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { SubscriberPreferenceEntity } from './subscriber-preference.entity';

const subscriberPreferenceSchema = new Schema(
  {
    _organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      index: true,
    },
    _environmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Environment',
      index: true,
    },
    _subscriberId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscriber',
      index: true,
    },
    _templateId: {
      type: Schema.Types.ObjectId,
      ref: 'NotificationTemplate',
      index: true,
    },
    enabled: {
      type: Schema.Types.Boolean,
      default: true,
    },
    channels: {
      email: {
        type: Schema.Types.Boolean,
        default: true,
      },
      sms: {
        type: Schema.Types.Boolean,
        default: true,
      },
      in_app: {
        type: Schema.Types.Boolean,
        default: true,
      },
      direct: {
        type: Schema.Types.Boolean,
        default: true,
      },
      push: {
        type: Schema.Types.Boolean,
        default: true,
      },
    },
  },
  schemaOptions
);

export interface ISubscriberPreferenceDocument extends SubscriberPreferenceEntity, Document {
  _id: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const SubscriberPreference =
  mongoose.models.SubscriberPreference ||
  mongoose.model<ISubscriberPreferenceDocument>('SubscriberPreference', subscriberPreferenceSchema);