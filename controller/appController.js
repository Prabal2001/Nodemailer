const nodemailer = require("nodemailer");
const { EMAIL, PASSWORD } = require("../env");
const Mailgen = require("mailgen");

//send mail from testing account
const appController = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
  let message = {
    from: "Fred Foo <foo@example.com>", // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Successfull Registered to our website", // plain text body
    html: "<b>Successfull Registered to our website</b>", // html body
  };
  transporter
    .sendMail(message)
    .then((info) => {
      return res.status(201).json({
        msg: "You should receive an email",
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info),
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
  // res.status(201).json("Signed up successfully..");
};

//send mail from real gmail account
const getBill = (req, res) => {
  const { userEmail } = req.body;
  let config = {
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  };
  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js",
    },
  });

  let response = {
    body: {
      name: "Prabal Arora",
      intro: "Your bill has arrived",
      table: {
        data: [
          {
            item: "NodeMailer Stack Book",
            description: "A backend application",
            price: "$10.99",
          },
        ],
      },
      outro: "Looking forward to do more business",
    },
  };
  let mail = MailGenerator.generate(response);
  let message = {
    from: EMAIL,
    to: userEmail,
    subject: "Placed Order !",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({ msg: "You should receive an email" });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });

  res.status(201).json("Signup successfull...");
};

module.exports = {
  appController,
  getBill,
};
