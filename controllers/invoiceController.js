const Invoice = require("../models/invoice");
const Client = require("../models/client");

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
    invoice.clientId = "";
    await invoice.save();
  } else {
    invoice.clientId = client[0]._id;
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
