import * as path from 'path';
import * as nodemailer from 'nodemailer';
import * as mailgunTransport from 'nodemailer-mailgun-transport';
import * as sendGridTransport from 'nodemailer-sendgrid';
import * as ejs from 'ejs';
import { log } from './../libraries/Log';
import { config } from './../config/config';
import i18n from './../libraries/i18n';

class EmailService {
  mailer: nodemailer.Transporter;

  constructor() {
    this.mailer = nodemailer.createTransport(mailgunTransport(config.email));
  }

  private send(
    email: string,
    subject: string,
    html: string,
  ): Promise<nodemailer.SentMessageInfo> {
    return this.mailer.sendMail({
      from: config.email.fromAddress,
      to: email,
      subject: subject,
      html: html,
    });
  }

  private sendPDF(
    email: string,
    subject: string,
    html: string,
    pdf: any,
  ): Promise<nodemailer.SentMessageInfo> {
    return this.mailer.sendMail({
      from: config.email.fromAddress,
      to: email,
      subject: subject,
      html: html,
      attachments: [{
        filename: "Lista.pdf",
        content: pdf
    }]
    });
  }

  private compileTemplate(context: any): Promise<string> {
    return ejs.renderFile(
      path.join(__dirname, '../views/email/template.ejs'),
      context,
    );
  }

  async sendEmail({
    email,
    subject,
    page,
    locale,
    context,
    pdf
  }: {
    email: string;
    subject: string;
    page: string;
    locale: string;
    context?: any;
    pdf?: any;
  }): Promise<boolean> {
    if (context == null) context = {};
    context.page = page;

    let t: any = {};
    i18n.init(t, t);
    if (locale == null) {
      locale = 'en';
    }
    t.setLocale(locale);

    context.__ = t.__;

    // Set server static files urls
    context.static_url = process.env.STATIC_FILES_URL;
    context.year = new Date().getFullYear();

    // Translate subject
    subject = t.__(subject);

    try {
      const html = await this.compileTemplate(context);
      log.debug(`Sending ${page} email to: ${email}`);
      if (pdf === null) {
        await this.send(email, subject, html);
      } else {
        await this.sendPDF(email, subject, html, pdf);
      }
      return true;
    } catch (err) {
      log.error(`Error sending ${page} email to: ${email}. ${err.message}`);
      return false;
    }
  }
}

const emailService = new EmailService();
export default emailService;
