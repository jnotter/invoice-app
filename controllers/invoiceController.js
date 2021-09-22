const Invoice = require("../models/invoice");
const Client = require("../models/client");
const invoice = require("../models/invoice");

exports.getInvoices = async (req, res) => {
  const invoices = await Invoice.find({});
  res.render("invoices/list", { invoices });
};

exports.createInvoice = async (req, res) => {
  const client = await Client.find({ name: req.body.invoice.name });
  const invoice = new Invoice(req.body.invoice);
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

  if (req.body.invoice.name === "") {
    invoice.client = "";
    await invoice.save();
  } else {
    invoice.client = client[0]._id;
    client[0].invoices.push(invoice);

    await invoice.save();

    await client[0].save();
  }
  res.redirect("/invoices");
};

exports.getClientsForNewInvoice = async (req, res) => {
  const clients = await Client.find({});
  const invoiceNumber = await Invoice.find({});
  res.render("invoices/new", {
    invoiceNumber: invoiceNumber.length,
    clients,
  });
};

exports.addClientForNewInvoice = async (req, res) => {
  const client = new Client(req.body.client);
  await client.save();
  res.redirect("/invoices/new");
};

exports.getInvoice = async (req, res) => {
  const { invoiceId } = req.params;
  const invoice = await Invoice.findById(invoiceId).populate("client");
  res.render("invoices/view", { invoice });
};

exports.editInvoice = async (req, res) => {
  const { invoiceId } = req.params;
  const invoice = await Invoice.findById(invoiceId).populate("client");
  const clients = await Client.find({});
  res.render("invoices/edit", { invoice, clients });
};

exports.updateInvoice = async (req, res) => {
  const { invoiceId } = req.params;

  const invoice = { ...req.body.invoice };

  const details = invoice.details;
  const client = await Client.find({ name: invoice.name });
  invoice.client = client[0]._id;
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
  client[0].invoices.push(invoiceId);
  console.log(client[0]);
  await client[0].save();
  res.redirect(`/invoices/${invoiceId}`);
};

exports.deleteInvoice = async (req, res) => {
  const { invoiceId } = req.params;
  await Invoice.findByIdAndDelete(invoiceId);
  res.redirect(`/invoices`);
};
