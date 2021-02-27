const express = require("express");
const router = express.Router();
const { sendContactForm } = require("../controllers/contact.js");

router.route("/").post(sendContactForm);

module.exports = router;
