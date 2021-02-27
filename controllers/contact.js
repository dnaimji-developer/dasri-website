const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.sendContactForm = async function (req, res) {
  var name = req.sanitize(req.body.name);
  var email = req.sanitize(req.body.email);
  var message = req.sanitize(req.body.message);

  const msg = {
    to: `${process.env.TO_EMAIL}`,
    from: `${process.env.FROM_EMAIL}`,
    subject: `Dasri's Website Contact Form`,
    text: message,
    html:
      `<h2>Name: </h2><p>${name}</p>` +
      `<h2>Email: </h2><p>${email}</p>` +
      `<h2>Message: </h2><p>${message}</p>`,
  };

  try {
    await sgMail.send(msg);
    req.flash(
      "success",
      "Your email was sent. Thank you for reaching out to me!"
    );
    res.redirect("/#contact-confirmation");
  } catch (error) {
    req.flash("error", "Sorry. Your email was unable to be sent.");
    res.redirect("/#contact-confirmation");
  }
};
