import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Create transporter with Zoho configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('Email transporter error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const sendVerificationEmail = async (email, name, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: {
      name: process.env.SENDER_NAME,
      address: process.env.SENDER_EMAIL
    },
    to: email,
    subject: "Verify Your Email - SkillSwap",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            background-color: #f5f5f5; 
            margin: 0; 
            padding: 20px; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 15px; 
            overflow: hidden; 
            box-shadow: 0 8px 32px rgba(0,0,0,0.1); 
          }
          .header { 
            background: linear-gradient(135deg, #e76f51, #f4a261); 
            padding: 40px 30px; 
            text-align: center; 
          }
          .header h1 { 
            color: white; 
            margin: 0; 
            font-size: 32px; 
            font-weight: bold;
          }
          .content { 
            padding: 40px 30px; 
          }
          .content h2 { 
            color: #264653; 
            margin-bottom: 20px; 
            font-size: 24px;
          }
          .content p { 
            color: #666; 
            line-height: 1.8; 
            margin-bottom: 20px; 
            font-size: 16px;
          }
          .verify-btn { 
            display: inline-block; 
            background: #264653; 
            color: white; 
            padding: 18px 40px; 
            text-decoration: none; 
            border-radius: 10px; 
            font-weight: bold; 
            font-size: 16px;
            margin: 25px 0; 
            transition: background 0.3s ease;
          }
          .verify-btn:hover { 
            background: #1a4d4a; 
          }
          .footer { 
            background: #f8f9fa; 
            padding: 25px; 
            text-align: center; 
            color: #666; 
            font-size: 14px; 
          }
          .warning { 
            background: #fff3cd; 
            border-left: 4px solid #ffc107; 
            padding: 15px; 
            margin: 25px 0; 
            color: #856404; 
            border-radius: 0 8px 8px 0;
          }
          .link-text {
            word-break: break-all; 
            color: #264653; 
            background: #f8f9fa; 
            padding: 10px; 
            border-radius: 5px; 
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SkillSwap</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Welcome to the Community!</p>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Thank you for joining SkillSwap! We're excited to have you in our community of skill sharers and learners.</p>
            <p>To complete your registration and start connecting with other members, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="verify-btn">Verify Email Address</a>
            </div>
            
            <div class="warning">
              <strong>Important:</strong> This verification link will expire in 24 hours for security reasons.
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <div class="link-text">${verificationUrl}</div>
            
            <p>If you didn't create an account with SkillSwap, please ignore this email.</p>
            
            <p>Happy skill swapping! <br><strong>The SkillSwap Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 SkillSwap. All rights reserved.</p>
            <p>This is an automated email, please do not reply to this address.</p>
            <p>Visit us at: <a href="${process.env.CLIENT_URL}" style="color: #264653;">skill-swap.social</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    // Add timeout to prevent hanging
    const info = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email timeout')), 30000) // 30 second timeout
      )
    ]);

    console.log('Verification email sent successfully to:', email);
    console.log('Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    
    // Provide specific error messages
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check email credentials.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Unable to connect to email server. Please try again later.');
    } else if (error.message === 'Email timeout') {
      throw new Error('Email sending timed out. Please try again.');
    } else {
      throw new Error(`Email service error: ${error.message}`);
    }
  }
};

// Add this function to your existing emailService.js

export const sendSessionReminderEmail = async (email, name, session, timeSlot) => {
  const partnerName = session.userA.name === name ? session.userB.name : session.userA.name;
  const skillExchange = `${session.skillFromA.name} ↔ ${session.skillFromB.name}`;
  
  const mailOptions = {
    from: {
      name: process.env.SENDER_NAME,
      address: process.env.SENDER_EMAIL
    },
    to: email,
    subject: "🔔 SkillSwap Session Reminder - Starting in 5 minutes!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            background-color: #f5f5f5; 
            margin: 0; 
            padding: 20px; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 15px; 
            overflow: hidden; 
            box-shadow: 0 8px 32px rgba(0,0,0,0.1); 
          }
          .header { 
            background: linear-gradient(135deg, #264653, #2a9d8f); 
            padding: 30px; 
            text-align: center; 
          }
          .header h1 { 
            color: white; 
            margin: 0; 
            font-size: 28px; 
            font-weight: bold;
          }
          .content { 
            padding: 30px; 
          }
          .reminder-box {
            background: #e76f51;
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin: 20px 0;
            font-size: 18px;
            font-weight: bold;
          }
          .session-details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            border-bottom: 1px solid #e9ecef;
            padding-bottom: 8px;
          }
          .detail-label {
            font-weight: bold;
            color: #264653;
          }
          .footer { 
            background: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            color: #666; 
            font-size: 14px; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Session Reminder</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your SkillSwap session is starting soon!</p>
          </div>
          <div class="content">
            <h2 style="color: #264653;">Hi ${name}! 👋</h2>
            
            <div class="reminder-box">
              ⏰ Your session starts in 5 minutes!
            </div>
            
            <div class="session-details">
              <div class="detail-row">
                <span class="detail-label">🤝 Partner:</span>
                <span>${partnerName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">📚 Skills:</span>
                <span>${skillExchange}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">🕐 Time Slot:</span>
                <span>${timeSlot}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">📅 Session ID:</span>
                <span>${session._id}</span>
              </div>
            </div>
            
            <p style="color: #666; text-align: center; margin-top: 30px;">
              Get ready to learn and share! 🚀<br>
              <strong>Good luck with your session!</strong>
            </p>
          </div>
          <div class="footer">
            <p>© 2025 SkillSwap. All rights reserved.</p>
            <p>📧 This is an automated reminder email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    console.log("attempting mail");
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Session reminder sent to ${email} for slot ${timeSlot}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send reminder to ${email}:`, error);
    throw error;
  }
};