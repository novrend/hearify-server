const nodeMailer = require("nodemailer");
const sendMail = async (req) => {
  try {
    let transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_SMTP,
        pass: process.env.PASS_SMTP,
      },
    });
    let mailOptions = {
      from: '"Hearify" <donotreplyhearify@gmail.com>',
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.body,
      html: req.body.html,
    };

    const sendMail = await transporter.sendMail(mailOptions);
    return sendMail;
  } catch (err) {
    throw { err };
  }
};

module.exports = sendMail;
