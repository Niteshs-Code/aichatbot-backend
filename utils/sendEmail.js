import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();



export const sendVerificationEmail = async (email, token, name) => {
  const verificationLink = `${process.env.WORK_URL}/api/auth/verify/${token}`;

  await apiInstance.sendTransacEmail({
  sender: {
    name: "Zento AI",
    email: process.env.EMAIL_USER, // yaha verified gmail
  },
  to: [
    {
      email: email,
      name: name,
    },
  ],
  subject: "Verify Your Email Address - Zento AI",
  htmlContent: `
      <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:40px 20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
          
          <h2 style="color:#333;">Hi ${name}, 👋</h2>
          
          <p style="font-size:16px; color:#555;">
            Welcome to <strong>YourApp</strong>! We're excited to have you onboard.
          </p>

          <p style="font-size:15px; color:#555;">
            To complete your registration and activate your account, please verify your email address by clicking the button below.
          </p>

          <div style="text-align:center; margin:30px 0;">
            <a href="${verificationLink}" 
               style="background-color:#28a745; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-size:16px; font-weight:bold; display:inline-block;">
               Verify Email
            </a>
          </div>

          <p style="font-size:14px; color:#777;">
            This link will expire in 24 hours for security reasons.
          </p>

          <p style="font-size:14px; color:#777;">
            If you did not create this account, you can safely ignore this email.
          </p>

          <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />

          <p style="font-size:12px; color:#aaa; text-align:center;">
            © ${new Date().getFullYear()} YourApp. All rights reserved.
          </p>

        </div>
      </div>
    `,
});
  
};

export const sendWelcomeEmail = async (email, name) => {


  await apiInstance.sendTransacEmail({
    sender: {
    name: "Zento AI",
    email: process.env.EMAIL_USER, 
  },
  to: [
    {
      email: email,
      name: name,
    },
  ],
    subject: "Welcome to Zento AI 🎉",
    htmlContent: `
      <div style="font-family: Arial; padding: 30px;">
        <h2>Hi ${name}, 👋</h2>
        <p>Welcome to <strong>YourApp</strong>!</p>
        <p>Your account has been successfully verified and activated.</p>
        <p>We're excited to have you onboard.</p>
        <br/>
        <p>Start exploring now 🚀</p>
      </div>
    `
  });
};


export const sendResetEmail = async (email, resetUrl, name) => {

  await apiInstance.sendTransacEmail({
    sender: {
    name: "Zento AI",
    email: process.env.EMAIL_USER, // yaha verified gmail
  },
  to: [
    {
      email: email,
      name: name,
    },
  ],
    subject: "Reset Your Zento AI Team Password",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:40px 20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
          
          <h2 style="color:#333;">Hi ${name}, 👋</h2>
          
          <p style="font-size:16px; color:#555;">
            We received a request to reset your password.
          </p>

          <div style="text-align:center; margin:30px 0;">
            <a href="${resetUrl}" 
               style="background-color:#dc3545; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:6px; font-size:16px; font-weight:bold; display:inline-block;">
               Reset Password
            </a>
          </div>

          <p style="font-size:14px; color:#777;">
            This link will expire in 10 minutes.
          </p>

          <p style="font-size:14px; color:#777;">
            If you did not request this, you can ignore this email.
          </p>

          <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />

          <p style="font-size:12px; color:#aaa; text-align:center;">
            © ${new Date().getFullYear()} YourApp. All rights reserved.
          </p>

        </div>
      </div>
    `
  });
};



// export const sendTestEmail = async (toEmail) => {
//   await apiInstance.sendTransacEmail({
//    sender: {
//     name: "Zento AI",
//     email: process.env.EMAIL_USER, // yaha verified gmail
//   },
//   to: [
//     {
//       email: toEmail,
     
//     },
//   ],
//     subject: "Deploy Test Email",
//     htmlContent: `<h1>If you received this, SMTP is working on deploy 🚀 </h1>`,
//   });
// };