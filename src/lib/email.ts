// Email service for sending notifications
// In production, this would use SendGrid, Resend, or similar service

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface QualifiedLeadEmailData {
  leadName: string;
  companyName: string;
  email: string;
  score: number;
  responses: Record<string, string>;
  leadUrl: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // In development, just log the email
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 Email would be sent:', {
      to: options.to,
      subject: options.subject,
      preview: options.text?.substring(0, 100) + '...'
    });
    return true;
  }

  // In production, integrate with email service
  try {
    // Example with SendGrid (uncomment and add @sendgrid/mail to dependencies)
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    await sgMail.send({
      to: options.to,
      from: 'notifications@qualify.ai',
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    */
    
    // For now, just log in production too
    console.log('Email sent:', options.to, options.subject);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

export function generateQualifiedLeadEmail(data: QualifiedLeadEmailData): EmailOptions {
  const scoreColor = data.score >= 80 ? '#16a34a' : data.score >= 60 ? '#ca8a04' : '#dc2626';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Qualified Lead</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h1 style="color: #111827; font-size: 24px; font-weight: 600; margin: 0 0 8px 0;">
              🎯 New Qualified Lead!
            </h1>
            
            <p style="color: #6b7280; font-size: 16px; margin: 0 0 24px 0;">
              A new lead has been qualified and is ready for follow-up.
            </p>
            
            <div style="background-color: #f9fafb; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
              <h2 style="color: #374151; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                Lead Details
              </h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Name:</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${data.leadName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Company:</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${data.companyName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email:</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">
                    <a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Score:</td>
                  <td style="padding: 8px 0;">
                    <span style="display: inline-block; padding: 4px 12px; background-color: ${scoreColor}; color: #ffffff; border-radius: 12px; font-size: 14px; font-weight: 600;">
                      ${data.score}/100
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #f9fafb; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
              <h3 style="color: #374151; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
                Key Responses
              </h3>
              ${Object.entries(data.responses).map(([key, value]) => `
                <p style="margin: 8px 0; font-size: 14px;">
                  <span style="color: #6b7280;">${key.replace(/_/g, ' ')}:</span>
                  <span style="color: #111827; font-weight: 500;">${value}</span>
                </p>
              `).join('')}
            </div>
            
            <a href="${data.leadUrl}" style="display: inline-block; padding: 12px 24px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
              View Full Details →
            </a>
          </div>
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
            You're receiving this because you have email notifications enabled for qualified leads.
            <br>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color: #6b7280;">Manage notifications</a>
          </p>
        </div>
      </body>
    </html>
  `;
  
  const text = `
New Qualified Lead!

Lead Details:
- Name: ${data.leadName}
- Company: ${data.companyName}
- Email: ${data.email}
- Score: ${data.score}/100

Key Responses:
${Object.entries(data.responses).map(([key, value]) => `- ${key.replace(/_/g, ' ')}: ${value}`).join('\n')}

View full details: ${data.leadUrl}
  `.trim();
  
  return {
    to: '', // Will be filled by caller
    subject: `🎯 New Qualified Lead: ${data.leadName} from ${data.companyName}`,
    html,
    text
  };
}

export function generateWelcomeEmail(userName: string, apiKey: string): EmailOptions {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Qualify.ai</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h1 style="color: #111827; font-size: 24px; font-weight: 600; margin: 0 0 8px 0;">
              Welcome to Qualify.ai, ${userName}! 🎉
            </h1>
            
            <p style="color: #6b7280; font-size: 16px; margin: 0 0 24px 0;">
              You're all set to start qualifying leads with AI. Here's everything you need to get started.
            </p>
            
            <div style="background-color: #f9fafb; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
              <h2 style="color: #374151; font-size: 18px; font-weight: 600; margin: 0 0 12px 0;">
                🚀 Quick Start Guide
              </h2>
              
              <ol style="margin: 0; padding-left: 20px; color: #374151;">
                <li style="margin-bottom: 8px;">Copy your widget code from the dashboard</li>
                <li style="margin-bottom: 8px;">Add it to your website (before the &lt;/body&gt; tag)</li>
                <li style="margin-bottom: 8px;">Verify installation to start collecting leads</li>
                <li style="margin-bottom: 8px;">Watch qualified leads roll in!</li>
              </ol>
            </div>
            
            <div style="background-color: #fef3c7; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>Your API Key:</strong> ${apiKey}<br>
                <span style="font-size: 12px;">Keep this secure and don't share it publicly</span>
              </p>
            </div>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/install" style="display: inline-block; padding: 12px 24px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
              Install Widget Now →
            </a>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
            
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Need help? Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL}/docs" style="color: #2563eb; text-decoration: none;">documentation</a> 
              or reply to this email and we'll help you get set up.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
  
  const text = `
Welcome to Qualify.ai, ${userName}! 🎉

You're all set to start qualifying leads with AI. Here's everything you need to get started.

Quick Start Guide:
1. Copy your widget code from the dashboard
2. Add it to your website (before the </body> tag)
3. Verify installation to start collecting leads
4. Watch qualified leads roll in!

Your API Key: ${apiKey}
(Keep this secure and don't share it publicly)

Install Widget Now: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/install

Need help? Check out our documentation at ${process.env.NEXT_PUBLIC_APP_URL}/docs or reply to this email.
  `.trim();
  
  return {
    to: '', // Will be filled by caller
    subject: 'Welcome to Qualify.ai! 🚀',
    html,
    text
  };
} 