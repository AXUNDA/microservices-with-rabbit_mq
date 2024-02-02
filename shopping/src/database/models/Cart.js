const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
    },
    items: [
      {
        product: {
          _id: { type: String },
          name: { type: String },
          banner: { type: String },
          price: { type: Number },
          desc: { type: String },
          supplier: { type: String },
          type: { type: String },
        },
        unit: {
          type: Number,
        },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("cart", cartSchema);
