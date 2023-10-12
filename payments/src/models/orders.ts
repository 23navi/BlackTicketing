import { orderStatus } from "@23navi/btcommon";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties
// that are requried to create a new Order
interface OrderAttrs {
  id: string;
  version: number;
  status: orderStatus;
  price: number;
  userId: string; // person who created that order
}

// An interface that describes the properties
// that a Order Document has ... we can have mongo created properties too.. eg createdAt
interface OrderDoc extends mongoose.Document {
//   id: string; // mongo created properties on it's own as we extend it from mongoose.Document
  version: number;
  status: orderStatus;
  price: number;
  userId: string; // person you created that order
}

// An interface that describes the properties
// that a Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(orderStatus),
    },
    userId: {
      type: String,
      require: true,
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
