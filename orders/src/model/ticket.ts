import { orderStatus } from "@23navi/btcommon";
import mongoose from "mongoose";
import { Order } from "./order";

interface TicketAttrs {
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function () {
  // this.ticket will give us the ticket on which this .isReserved is called...

  // We will get all the orders where ticket is this ticket and status is something other than canceled
  const orders = await Order.find({
    ticket: this,
    status: { $ne: orderStatus.Cancelled },
  });
  return orders.length > 0;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };