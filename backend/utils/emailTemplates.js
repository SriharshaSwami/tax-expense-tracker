export const getPasswordResetEmailTemplate = (resetUrl, userName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - TaxExpense Planner</title>
      <style>
        /* Base Resets */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
          color: #334155;
        }
        .wrapper {
          width: 100%;
          table-layout: fixed;
          background-color: #f8fafc;
          padding: 40px 0;
        }
        .main-table {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .header {
          background-color: #047857;
          background-image: linear-gradient(135deg, #047857 0%, #059669 100%);
          padding: 35px 40px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .content {
          padding: 45px 40px;
        }
        .content h2 {
          color: #0f172a;
          font-size: 20px;
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 20px;
        }
        .content p {
          font-size: 16px;
          line-height: 1.6;
          margin: 0 0 24px 0;
          color: #475569;
        }
        .button-wrapper {
          text-align: center;
          margin: 40px 0;
        }
        .btn {
          display: inline-block;
          background-color: #10b981;
          color: #ffffff !important;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          padding: 16px 36px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        }
        .raw-link-container {
          background-color: #f1f5f9;
          padding: 16px;
          border-radius: 6px;
          margin-bottom: 30px;
          word-break: break-all;
        }
        .raw-link {
          color: #059669;
          font-size: 14px;
          text-decoration: none;
        }
        .security-notice {
          border-top: 2px solid #f1f5f9;
          padding-top: 24px;
          margin-top: 24px;
        }
        .security-notice p {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 0;
        }
        .security-notice strong {
          color: #334155;
        }
        .footer {
          padding: 24px 40px;
          background-color: #f8fafc;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer p {
          font-size: 13px;
          color: #94a3b8;
          margin: 0 0 8px 0;
        }
        
        /* Mobile Responsiveness */
        @media screen and (max-width: 600px) {
          .main-table { width: 100% !important; border-radius: 0 !important; border-left: none; border-right: none; }
          .wrapper { padding: 0 !important; }
          .header { padding: 30px 20px !important; }
          .content { padding: 30px 20px !important; }
          .footer { padding: 20px !important; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <table class="main-table" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td class="header">
              <h1>TaxExpense Planner</h1>
            </td>
          </tr>
          <tr>
            <td class="content">
              <h2>Password Reset Request</h2>
              <p>Hello ${userName},</p>
              <p>We received a request to reset the password for your TaxExpense Planner account. To maintain the security of your financial data, this reset link will securely expire in <strong>10 minutes</strong>.</p>
              
              <div class="button-wrapper">
                <a href="${resetUrl}" class="btn">Reset Password</a>
              </div>
              
              <p style="font-size: 14px;">If the button above isn't working, copy and paste the following URL into your web browser:</p>
              <div class="raw-link-container">
                <a href="${resetUrl}" class="raw-link">${resetUrl}</a>
              </div>
              
              <div class="security-notice">
                <p><strong>Did you not request this?</strong><br>
                If you did not initiate this request, you can safely ignore this email. Your account remains completely secure and your password has not been altered.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>&copy; ${new Date().getFullYear()} TaxExpense Planner. All rights reserved.</p>
              <p>This is an automated security notification. Please do not reply.</p>
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;
};
