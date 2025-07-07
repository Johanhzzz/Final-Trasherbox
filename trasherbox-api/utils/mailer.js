const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "trasherbox.soporte@gmail.com",
    pass: "ovrlsgvberkbezaj",
  },
});

module.exports = transporter;
