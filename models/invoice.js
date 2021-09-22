const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  name: String,
  client: {
    type: Schema.Types.ObjectId,
    ref: "Client",
  },
  invoiceNumber: Number,
  issueDate: Date,
  dueDate: Date,
  details: {
    description: [String],
    quantity: [Number],
    rate: [Number],
    total: Number,
    tax: Number,
    finalAmount: Number,
  },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
