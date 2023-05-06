import nodemailer from "nodemailer";
export async function sendLoginEmail({
  email,
  url,
  token,
}: {
  email: string;
  url: string;
  token: string;
}) {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethernal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: `"jane doe" <join.doe@exampleRouter.com>`,
    to: email,
    subject: "login to your account",
    html: `Login by clicking here <a href="${url}/login#token=${token}"`,
  });

  console.log("preview URL:", nodemailer.getTestMessageUrl);
}
