import mongoose from "mongoose";
import { orderStatus } from "@23navi/btcommon";
import { TicketDoc } from "./ticket";

interface OrderAttrs {
  userId: string;
  status: orderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  status: orderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      required: false, // This is not required as for some orders we don't want to expire them.. eg: Order with is confirmed.. Expiration is just for orders which are in lockdown state.
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(orderStatus),
      default: orderStatus.Created,
    },
    userId: {
      type: String,
      require: true,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
