const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "trasherbox.soporte@gmail.com",
    pass: "tu_app_password",
  },
});

module.exports = transporter;
