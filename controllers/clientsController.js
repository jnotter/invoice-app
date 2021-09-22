const Client = require("../models/client");
const Invoice = require("../models/invoice");

exports.getClients = async (req, res) => {
  const clients = await Client.find({});
  res.render("clients/index", { clients });
};

exports.createClient = async (req, res) => {
  const client = new Client(req.body.client);
  await client.save();
  await res.redirect("/clients");
};

exports.getClient = async (req, res) => {
  const clients = await Client.findById(req.params.id).populate("invoices");
  const { invoices } = clients;
  res.render("clients/show", { clients, invoices });
};

exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const client = await Client.findByIdAndUpdate(id, { ...req.body.client });
  res.redirect("/clients");
};
