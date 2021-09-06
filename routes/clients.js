const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError');
const Client = require('../models/client');
const Invoice = require('../models/invoice');
// const { campgroundSchema } = require('../schemas')

const validateClient = (req, res, next) => {
    const { error } = clientSchema.validate(req.body);
    if(error) {
        const msg = error.details.map( el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', async (req, res) => {
    const clients = await Client.find({});
    res.render('clients/index', {clients})
})

router.post('/', async(req, res) => {
    const client = new Client(req.body.client);
    await client.save(); 
    await res.redirect('/clients')
})


router.get('/new', (req, res) => {
    res.render('clients/new')
})

router.get('/:id', async(req, res) => {
    const clients = await Client.findById(req.params.id).populate('invoices');
    const {invoices} = clients
    res.render('clients/show', { clients, invoices })
})

router.put('/:id', async(req, res) => {
    const { id } = req.params;
    const client = await Client.findByIdAndUpdate(id, {...req.body.client});
    res.redirect('/clients');
})

router.get('/:id/edit', async (req, res) => {
    const clients = await Client.findById(req.params.id);
    res.render('clients/edit', { clients });

})

router.get('/:id/invoice/:invoiceId', async(req, res) => {
    const { id, invoiceId } = req.params;
    const clients = await Client.findById(id)
    const invoice = await Invoice.findById(invoiceId)
    res.render('invoices/view', { clients, invoice })
})




module.exports = router;