import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import Admin from '../models/Admin.js';

const router = express.Router();

const getTransporter = () => nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// ── POST /api/admin-auth/forgot-password ──
router.post('/forgot-password', async (req, res) => {
  try {
    let admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });

    if (!admin) {
      admin = new Admin({
        username: process.env.VITE_ADMIN_USERNAME || 'strucureo',
        password: process.env.VITE_ADMIN_PASSWORD || 'admin@123#',
        email: process.env.ADMIN_EMAIL || 'blizzencreations@gmail.com',
      });
      await admin.save();
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    admin.resetToken = resetToken;
    admin.resetTokenExpiry = resetTokenExpiry;
    await admin.save();

    const resetUrl = `${process.env.VITE_FRONTEND_URL || 'http://localhost:8080'}/reset-password?token=${resetToken}`;

    await getTransporter().sendMail({
      from: `"Blizzen Creations" <${process.env.GMAIL_USER}>`,
      to: admin.email,
      subject: '🔐 Admin Password Reset - Blizzen Creations',
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; background: #f0f7f5; padding: 32px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 60px; height: 60px; background: #1e3a35; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px;">🔐</div>
            <h2 style="color: #1e3a35; margin-top: 12px; font-size: 22px;">Password Reset Request</h2>
            <p style="color: #64748b; font-size: 14px;">Blizzen Creations Admin Panel</p>
          </div>
          <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #a7c4bc;">
            <p style="color: #0f172a; font-size: 15px; margin-bottom: 20px;">
              You requested to reset your admin credentials. Click the button below to set a new username and password.
            </p>
            <a href="${resetUrl}" style="display: block; text-align: center; background: #1e3a35; color: white; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px;">
              Reset My Credentials →
            </a>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 16px; text-align: center;">
              This link expires in <strong>1 hour</strong>. If you didn't request this, ignore this email.
            </p>
          </div>
          <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 16px;">
            © Blizzen Creations • Chennai's Premier IT Institute
          </p>
        </div>
      `,
    });

    res.json({ success: true, message: 'Reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Failed to send reset email' });
  }
});

// ── GET /api/admin-auth/verify-token?token=xxx ──
router.get('/verify-token', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ success: false, message: 'Token required' });

    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    res.json({ success: true, message: 'Token valid' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/admin-auth/reset-password ──
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newUsername, newPassword } = req.body;

    if (!token || !newUsername || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    admin.username = newUsername;
    admin.password = newPassword;
    admin.resetToken = null;
    admin.resetTokenExpiry = null;
    await admin.save();

    await getTransporter().sendMail({
      from: `"Blizzen Creations" <${process.env.GMAIL_USER}>`,
      to: admin.email,
      subject: '✅ Admin Credentials Updated - Blizzen Creations',
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; background: #f0f7f5; padding: 32px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 60px; height: 60px; background: #1e3a35; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px;">✅</div>
            <h2 style="color: #1e3a35; margin-top: 12px;">Credentials Updated!</h2>
          </div>
          <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #a7c4bc;">
            <p style="color: #0f172a; font-size: 15px;">Your admin credentials have been successfully updated.</p>
            <div style="background: #f0f7f5; border-radius: 8px; padding: 12px; margin-top: 12px;">
              <p style="margin: 0; font-size: 14px; color: #64748b;">New Username: <strong style="color: #1e3a35;">${newUsername}</strong></p>
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">
              If you didn't make this change, contact support immediately.
            </p>
          </div>
        </div>
      `,
    });

    res.json({ success: true, message: 'Credentials updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset credentials' });
  }
});

// ── POST /api/admin-auth/verify-login ──
router.post('/verify-login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username, password });
    if (admin) {
      return res.json({ success: true, message: 'Login successful' });
    }

    res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
