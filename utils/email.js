const nodemailer = require('nodemailer');
const pug = require('pug');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Aditya Gupta <${process.env.EMAIL_FROM}>`; // Use "this.from" instead of "this.form"
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'ad13002ag@gmail.com',
          pass: 'cudjzdfnnijgnceu'
        }
      });
    }
    return null; // Return null for non-production environment
  }

  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject
      }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: html
    };

    const transporter = this.newTransport(); // Store the transporter in a variable
    if (transporter) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log('Email sending is disabled in non-production environment.');
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token is valid for 10 minutes only!'
    );
  }
};
