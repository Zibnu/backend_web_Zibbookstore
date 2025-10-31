const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const renderEmail = require("./Email/renderEmail");

dotenv.config();

const transporter = nodemailer.createTransport({
  host : process.env.SMTP_HOST,
  port : Number(process.env.SMTP_PORT) ,
  secure : process.env.SMTP_SECURE === "true", //False for TLS
  auth : {
    user : process.env.EMAIL_USER,
    pass : process.env.EMAIL_PASS,
  },
  tls : {
    rejectUnauthorized : false,//lewati validasi verifikasi jika diperlukan
  }, 
});

/**
 * Kirim email menggunakan JSX template
 * @param {string} to
 * @param {string} subject
 * @param {string} templateName - nama file JSX (tanpa .jsx)
 * @param {object} data - props untuk template
 */

async function sendEmail(to, subject, templateName, data = {}) {
  try {
    const htmlContent = await renderEmail(templateName, data);

    const mailOptions = {
      from : `ZibBookstore`,
      to,
      subject,
      html : htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email Terkirim", info.response);
  } catch (error) {
    console.error( error || "Gagal Mengirim Email")
  }
}

module.exports = {sendEmail};