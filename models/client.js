const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    name: String,
    address: String,
    city: String,
    province: String,
    number: Number,
    email: String,
    invoices: [{
        type: Schema.Types.ObjectId,
        ref: 'Invoice'
    }]

})

module.exports = mongoose.model('Client', ClientSchema);