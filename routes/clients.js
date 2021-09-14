const express = require('express');
const fs = require('fs');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError');
const Client = require('../models/client');
const Invoice = require('../models/invoice');
const puppeteer = require('puppeteer');

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

router.delete('/:id/invoice/:invoiceId', async(req, res) => {
    const { id, invoiceId } = req.params;
    await Invoice.findByIdAndDelete(invoiceId);
    res.redirect(`/clients/${id}`)

})

router.get('/:id/invoice/:invoiceId/generate', async(req, res) => {
    const { id, invoiceId } = req.params;
    const url = `http://localhost:3000/clients/${id}/invoice/${invoiceId}`;

    const browser = await puppeteer.launch({
        headless: true
    });

    const webPage = await browser.newPage();
    await webPage.setViewport({ width: 1200, height: 800})

    await webPage.goto(url, {
        waitUntil: "networkidle0"
    });
    
    const pdf = await webPage.pdf({

        format: "Letter",
        width: '100%'
    });

    await browser.close();

    res.contentType("application/pdf");
    res.send(pdf);

})

router.get('/:id/invoice/:invoiceId/edit', async(req, res) => {
    const { id, invoiceId } = req.params;
    const invoice = await Invoice.findById(invoiceId);
    const clients = await Client.findById(id)
    
    res.render("invoices/edit", { clients, invoice })
})

router.put('/:id/invoice/:invoiceId', async(req, res) => {
    const { id, invoiceId } = req.params;
    
    invoice = {...req.body.invoice}
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
    await Invoice.findByIdAndUpdate(invoiceId, {...invoice});
    res.redirect(`/clients/${id}`);
})





module.exports = router;