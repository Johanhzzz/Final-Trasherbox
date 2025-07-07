const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "trasherbox.soporte@gmail.com",
    pass: "tu_app_password", // usa una variable de entorno en producción
  },
});

module.exports = transporter;
