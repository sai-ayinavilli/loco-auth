import sdk from 'node-appwrite';
import axios from 'axios';
import 'dotenv/config'; // Automatically loads .env

export default async function(req, res) {
  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  try {
    const payload = JSON.parse(req.payload || '{}');
    const { to, from, subject, name, otp } = payload;

    if (!to || !from || !subject || !otp) {
      return res.json({ success: false, message: 'Missing required parameters' });
    }

    const brevoData = {
      sender: { name: 'LocoAI Support', email: from },
      to: [{ email: to, name: name || 'User' }],
      subject,
      htmlContent: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
              .content { padding: 20px; background-color: #ffffff; border-radius: 0 0 5px 5px; }
              .otp-code { font-size: 24px; font-weight: bold; text-align: center; padding: 15px; background-color: #f1f1f1; border-radius: 5px; letter-spacing: 5px; margin: 20px 0; }
              .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Verify Your Email Address</h2>
              </div>
              <div class="content">
                <p>Hello ${name || 'there'},</p>
                <p>Thank you for signing up! To complete your registration, please use the verification code below:</p>
                <div class="otp-code">${otp}</div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this code, you can safely ignore this email.</p>
              </div>
              <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
                <p>&copy; ${new Date().getFullYear()} LocoAI. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    const response = await axios.post('https://api.brevo.com/v3/smtp/email', brevoData, {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      }
    });

    return res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: response.data?.messageId
    });

  }
