export const getPasswordResetEmailTemplate = (resetUrl, userName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f4f7f6;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .email-container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        .email-header {
          background-color: #059669; /* Emerald 600 */
          color: #ffffff;
          padding: 30px 40px;
          text-align: center;
        }
        .email-header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .email-body {
          padding: 40px;
          color: #374151; /* Gray 700 */
          line-height: 1.6;
        }
        .email-body p {
          margin: 0 0 20px 0;
          font-size: 16px;
        }
        .btn-container {
          text-align: center;
          margin: 35px 0;
        }
        .reset-btn {
          display: inline-block;
          background-color: #10b981; /* Emerald 500 */
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          padding: 14px 32px;
          border-radius: 6px;
          transition: background-color 0.2s;
        }
        .reset-btn:hover {
          background-color: #059669;
        }
        .warning-text {
          font-size: 14px;
          color: #6b7280; /* Gray 500 */
          background-color: #f9fafb;
          padding: 15px;
          border-left: 4px solid #d1d5db;
          border-radius: 4px;
          margin-top: 30px;
        }
        .email-footer {
          background-color: #f9fafb;
          padding: 20px 40px;
          text-align: center;
          font-size: 14px;
          color: #9ca3af; /* Gray 400 */
          border-top: 1px solid #e5e7eb;
        }
        .email-footer p {
          margin: 5px 0;
        }
        .raw-link {
          word-break: break-all;
          color: #059669;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>TaxExpense Planner</h1>
        </div>
        <div class="email-body">
          <p>Hi ${userName},</p>
          <p>We received a request to reset the password for your TaxExpense Planner account. Don't worry, we've got you covered!</p>
          <p>Click the secure button below to choose a new password. This link is valid for the next <strong>1 hour</strong>.</p>
          
          <div class="btn-container">
            <a href="${resetUrl}" class="reset-btn">Reset My Password</a>
          </div>
          
          <p>If the button doesn't work, you can copy and paste the following link directly into your browser:</p>
          <p class="raw-link"><a href="${resetUrl}" style="color: #059669;">${resetUrl}</a></p>
          
          <div class="warning-text">
            <strong>Didn't request this?</strong><br>
            If you didn't ask to reset your password, you can safely ignore this email. Your account is secure and your password has not been changed.
          </div>
        </div>
        <div class="email-footer">
          <p>&copy; ${new Date().getFullYear()} TaxExpense Planner. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
