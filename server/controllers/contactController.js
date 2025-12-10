import nodemailer from 'nodemailer';

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

/**
 * @desc    Send contact form email
 * @route   POST /api/contact/send-email
 * @access  Public
 */
export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate inputs
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if Gmail credentials are configured
    if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_PASSWORD) {
      console.error('Gmail credentials not configured');
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured. Please contact support.'
      });
    }

    // Email to admin
    const adminMailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: 'offcampusjobs786@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>This email was sent from the contact form on Offcampus Jobs website.</small></p>
      `,
      replyTo: email,
    };

    // Confirmation email to user
    const userMailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: 'We received your message - Offcampus Jobs',
      html: `
        <h2>Thank you for contacting Offcampus Jobs</h2>
        <p>Hi ${name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Best regards,<br>Offcampus Jobs Team</p>
        <p><small>Contact: offcampusjobs786@gmail.com</small></p>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully. We will get back to you soon.'
    });
  } catch (error) {
    console.error('Send Contact Email Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later.',
      error: error.message
    });
  }
};
