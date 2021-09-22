const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Invoice = require("../models/invoice");
const Client = require("../models/client");

const invoiceController = require("../controllers/invoiceController");

router
  .route("/")
  .get(invoiceController.getInvoices)
  .post(catchAsync(invoiceController.createInvoice));

router
  .route("/new")
  .get(invoiceController.getClientsForNewInvoice)
  .post(invoiceController.addClientForNewInvoice);

router
  .route("/:invoiceId")
  .get(invoiceController.getInvoice)
  .put(invoiceController.updateInvoice)
  .delete(invoiceController.deleteInvoice);

router.get("/:invoiceId/edit", invoiceController.editInvoice);

module.exports = router;
