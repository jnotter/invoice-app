const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const invoiceController = require("../controllers/invoiceController");

router
  .route("/")
  .get(invoiceController.getInvoices)
  .post(catchAsync(invoiceController.createInvoice));

router
  .route("/new")
  .get(invoiceController.getClientsForNewInvoice)
  .post(invoiceController.addClientForNewInvoice);

module.exports = router;
