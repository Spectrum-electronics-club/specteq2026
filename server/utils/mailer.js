const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ─── HTML Email Base Template ─────────────────────────────────────────────────
const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Specteq 2026</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e293b 0%,#334155 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
                ⚡ Specteq 2026
              </h1>
              <p style="margin:6px 0 0;color:#94a3b8;font-size:14px;">Spectrum Electronics Club</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                © 2026 Specteq — Spectrum Electronics Club &nbsp;|&nbsp;
                This is an automated email, please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ─── OTP Email ────────────────────────────────────────────────────────────────
const sendOtpEmail = async (to, otp) => {
  const html = baseTemplate(`
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;font-weight:700;">Verify Your Email</h2>
    <p style="margin:0 0 28px;color:#64748b;font-size:15px;line-height:1.6;">
      Use the OTP below to verify your email address for your Specteq 2026 account.
      This code expires in <strong>10 minutes</strong>.
    </p>

    <div style="background:#f0f9ff;border:2px dashed #0ea5e9;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
      <p style="margin:0 0 8px;color:#0369a1;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Your OTP Code</p>
      <p style="margin:0;font-size:48px;font-weight:900;letter-spacing:12px;color:#0c4a6e;font-family:'Courier New',monospace;">${otp}</p>
    </div>

    <p style="margin:0;color:#94a3b8;font-size:13px;">
      ⚠️ If you did not request this, please ignore this email.
    </p>
  `);

  await transporter.sendMail({
    from: `"Specteq 2026" <${process.env.GMAIL_USER}>`,
    to,
    subject: `${otp} is your Specteq 2026 verification code`,
    html,
  });
};

// ─── Registration Success Email ───────────────────────────────────────────────
const sendRegistrationEmail = async (to, fullName) => {
  const html = baseTemplate(`
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;font-weight:700;">
      🎉 Registration Successful!
    </h2>
    <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;">
      Hi <strong>${fullName}</strong>, welcome to <strong>Specteq 2026</strong>!
      Your account has been successfully created and verified.
    </p>

    <div style="background:#f0fdf4;border-left:4px solid #22c55e;border-radius:8px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0;color:#166534;font-size:14px;line-height:1.7;">
        ✅ Your account is now active.<br/>
        🏆 You can now log in, create or join a team, and start your Specteq journey.<br/>
        📋 Make sure to review the competition rules before submitting.
      </p>
    </div>

    <a href="${process.env.FRONTEND_URL || 'https://specteq2026.vercel.app'}/login"
       style="display:inline-block;background:linear-gradient(135deg,#1e293b,#334155);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:15px;">
      Go to Dashboard →
    </a>
  `);

  await transporter.sendMail({
    from: `"Specteq 2026" <${process.env.GMAIL_USER}>`,
    to,
    subject: '🎉 Welcome to Specteq 2026 — Registration Successful!',
    html,
  });
};

// ─── Team Join Email ──────────────────────────────────────────────────────────
const sendTeamJoinEmail = async (to, fullName, teamName, inviteCode) => {
  const html = baseTemplate(`
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;font-weight:700;">
      🚀 You've Joined a Team!
    </h2>
    <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;">
      Hi <strong>${fullName}</strong>, you have successfully joined a team on Specteq 2026!
    </p>

    <div style="background:#fdf4ff;border:2px solid #e879f9;border-radius:12px;padding:24px 28px;margin-bottom:28px;">
      <p style="margin:0 0 6px;color:#86198f;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Your Team</p>
      <p style="margin:0;color:#4a044e;font-size:28px;font-weight:900;">${teamName}</p>
      ${inviteCode ? `<p style="margin:8px 0 0;color:#a21caf;font-size:13px;">Invite Code: <strong style="font-family:'Courier New',monospace;letter-spacing:2px;">${inviteCode}</strong></p>` : ''}
    </div>

    <div style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:8px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0;color:#92400e;font-size:14px;line-height:1.7;">
        🤝 Share your team's invite code with teammates to bring them on board.<br/>
        📌 Keep an eye on announcements from the organizers.<br/>
        🏆 Good luck at Specteq 2026!
      </p>
    </div>

    <a href="${process.env.FRONTEND_URL || 'https://specteq2026.vercel.app'}/dashboard"
       style="display:inline-block;background:linear-gradient(135deg,#1e293b,#334155);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:15px;">
      View Dashboard →
    </a>
  `);

  await transporter.sendMail({
    from: `"Specteq 2026" <${process.env.GMAIL_USER}>`,
    to,
    subject: `🚀 You've joined "${teamName}" on Specteq 2026!`,
    html,
  });
};

module.exports = { sendOtpEmail, sendRegistrationEmail, sendTeamJoinEmail };
