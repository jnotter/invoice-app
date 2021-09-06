const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError');
const Invoice = require('../models/invoice');
const Client = require('../models/client')

router.get('/', async (req, res) => {
    const invoices = await Invoice.find({});
    res.render('invoices/list', {invoices})
})

router.get('/new', async (req, res) => {
    const clients = await Client.find({})
    const invoiceNumber = await Invoice.find({})
    res.render('invoices/new', { invoiceNumber: invoiceNumber.length, clients })
})

router.post('/new', async(req, res) => {
    const client = new Client(req.body.client);
    await client.save();
    res.redirect('/invoices/new');
})

router.post('/', catchAsync(async(req, res) => {
    const client = await Client.find({name: req.body.invoice.name});
    const invoice = new Invoice(req.body.invoice)
    details = invoice.details
    let total = 0;
    for (let i = 0; i < details.rate.length; i++) {
        const subtotal = details.quantity[i] * details.rate[i];
        total += subtotal
        
    }

    details.total = total
    client[0].invoices.push(invoice);
    
    // await Client.findByIdAndUpdate(id, { $push: { invoices: invoice._id}}, { new: true })
    // if (!Array.isArray(client.invoices)) {
    //     client.invoices = [];
    // }
    // if (client) {
    // client.invoices.push(invoice._id)
    // console.log(invoice)
    // console.log(client.invoices)
    await invoice.save();
    // await client.markModified('invoices')
    await client[0].save();
    res.redirect('/invoices')
    // } else {
    //     await invoice.save
    //     res.redirect('/invoices')
    // }
}))



module.exports = router;