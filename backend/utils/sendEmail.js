import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
await transporter.verify();
console.log("SMTP Connected Successfully");

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Smart Task Manager" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;