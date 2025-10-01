const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure the email transport using Gmail
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "nhatluan064@gmail.com", // Fallback for local testing
    pass: process.env.EMAIL_PASS, // App password for Gmail
  },
});

exports.sendFeedbackEmail = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  const { rating, category, title, description } = data;
  const userEmail = context.auth.token.email || "anonymous";
  const userName = context.auth.token.name || userEmail;

  const mailOptions = {
    from: functions.config().email.user,
    to: "nhatluan064@gmail.com", // Developer email
    subject: `IT Inventory Feedback: ${title}`,
    html: `
      <h2>New Feedback Received</h2>
      <p><strong>From:</strong> ${userName} (${userEmail})</p>
      <p><strong>Rating:</strong> ${rating} stars</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Description:</strong></p>
      <p>${description.replace(/\n/g, "<br>")}</p>
      <hr>
      <p><small>Sent at: ${new Date().toISOString()}</small></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Feedback sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to send feedback email"
    );
  }
});
