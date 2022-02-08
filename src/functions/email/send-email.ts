import { default as nodemailer } from 'nodemailer';

export interface SendEmailConfig {
  from: string;
  html: string;
  subject: string;
  to: string;
}

export async function sendEmail(config: SendEmailConfig) {
  const port: number = 587;
  const transporter = nodemailer.createTransport({
    auth: {
      pass: '',
      user: ''
    },
    host: 'smtp.ethereal.email',
    port,
    secure: port === 465
  });

  const info = await transporter.sendMail(config);
  console.log(`Message sent: ${info.messageId}`);
  console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

  return info;
}
