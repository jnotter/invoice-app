const express = require("express");
const router = express.Router();
const Client = require("../models/client");
const Invoice = require("../models/invoice");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const clientsController = require("../controllers/clientsController");
const { Touchscreen } = require("puppeteer");

const validateClient = (req, res, next) => {
  const { error } = clientSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router
  .route("/")
  .get(clientsController.getClients)
  .post(clientsController.createClient);

router.get("/new", (req, res) => {
  res.render("clients/new");
});

router
  .route("/:id")
  .get(clientsController.getClient)
  .put(clientsController.updateClient);

router.get("/:id/edit", async (req, res) => {
  const clients = await Client.findById(req.params.id);
  res.render("clients/edit", { clients });
});

router.get("/:id/invoice/:invoiceId", async (req, res) => {
  const { id, invoiceId } = req.params;
  const clients = await Client.findById(id);
  const invoice = await Invoice.findById(invoiceId);
  res.render("invoices/view", { clients, invoice });
});

router.delete("/:id/invoice/:invoiceId", async (req, res) => {
  const { id, invoiceId } = req.params;
  await Invoice.findByIdAndDelete(invoiceId);
  res.redirect(`/clients/${id}`);
});

router.get("/:id/invoice/:invoiceId/edit", async (req, res) => {
  const { id, invoiceId } = req.params;
  const invoice = await Invoice.findById(invoiceId);
  const clients = await Client.findById(id);

  res.render("invoices/edit", { clients, invoice });
});

router.put("/:id/invoice/:invoiceId", async (req, res) => {
  const { id, invoiceId } = req.params;

  invoice = { ...req.body.invoice };
  details = invoice.details;
  let total = 0;
  for (let i = 0; i < details.rate.length; i++) {
    const subtotal = details.quantity[i] * details.rate[i];
    total += subtotal;
  }
  const tax = total * 0.13;
  const finalAmount = total + tax;

  details.total = total;
  details.tax = tax;
  details.finalAmount = finalAmount;
  await Invoice.findByIdAndUpdate(invoiceId, { ...invoice });
  res.redirect(`/clients/${id}`);
});

module.exports = router;
