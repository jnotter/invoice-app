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

module.exports = router;
