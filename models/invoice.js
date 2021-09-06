const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    name: String,
    clientId: String,
    invoiceNumber: Number,
    issueDate: Date,
    dueDate: Date,    
    details:  {
        description: [String],
        quantity: [Number],
        rate: [Number],
        total: Number
    }

})

module.exports = mongoose.model('Invoice', invoiceSchema);