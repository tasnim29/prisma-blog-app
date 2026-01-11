import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URl!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  // verify email
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

        const info = await transporter.sendMail({
          from: `"Prisma Blog" <${process.env.APP_USER}>`,
          to: user.email,
          subject: "Verify your email address",
          html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Email Verification</title>
          </head>
          <body style="margin:0; padding:0; background-color:#f4f4f4;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:30px; font-family: Arial, sans-serif;">
                    
                    <tr>
                      <td style="text-align:center;">
                        <h2 style="color:#333;">Verify Your Email</h2>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 20px 0; color:#555; font-size:15px;">
                        <p>Hello ${user.email},</p>

                        <p>
                          Thanks for signing up for <strong>Prisma Blog</strong>.
                          Please confirm your email address by clicking the button below.
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a href="${verificationUrl}"
                           style="
                             background-color:#4f46e5;
                             color:#ffffff;
                             padding:12px 24px;
                             text-decoration:none;
                             border-radius:6px;
                             font-weight:bold;
                             display:inline-block;
                           ">
                          Verify Email
                        </a>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding-top: 20px; color:#777; font-size:14px;">
                        <p>
                          If you did not create this account, you can safely ignore this email.
                        </p>

                        <p>
                          This verification link will expire for security reasons.
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding-top: 30px; border-top:1px solid #eee; text-align:center; font-size:12px; color:#999;">
                        © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
        });

        console.log("Verification email sent:", info.messageId);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
