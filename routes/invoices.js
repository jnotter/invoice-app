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
    const invoice = new Invoice(req.body.invoice);
    invoice.clientId = client[0]._id;
    details = invoice.details;
    let total = 0;
    for (let i = 0; i < details.rate.length; i++) {
        const subtotal = details.quantity[i] * details.rate[i];
        total += subtotal
        
    }
    const tax = total * .13
    const finalAmount = total + tax

    details.total = total;
    details.tax = tax;
    details.finalAmount = finalAmount;
    client[0].invoices.push(invoice);
    
    await invoice.save();

    await client[0].save();
    res.redirect('/invoices')

}))






module.exports = router;