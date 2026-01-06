const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Resend } = require("resend");

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://joel-backend-portfolio.onrender.com"
  ],
  methods: ["POST", "GET"],
}));

app.use(express.json());

app.post("/send-message", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["yourmail@gmail.com"], // where YOU receive messages
      replyTo: email,
      subject: "📩 Message From Your Portfolio",
      html: `
        <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
          
          <h2 style="color:#4f46e5;">
            “You’ve got a new message!” ✨
          </h2>

          <p>
            Someone just reached out through your portfolio.
            Here are the details 👇
          </p>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />

          <p><strong>👤 Name:</strong> ${name}</p>

          <p>
            <strong>📧 Email:</strong>
            <a href="mailto:${email}" style="color:#2563eb;">
              ${email}
            </a>
          </p>

          <p><strong>💬 Message:</strong></p>

          <blockquote style="
            margin: 12px 0;
            padding: 12px 16px;
            background: #f9fafb;
            border-left: 4px solid #4f46e5;
            color: #374151;
          ">
            ${message}
          </blockquote>

          <p style="margin-top:24px;">
            🚀 This message was sent from your portfolio contact form.
          </p>

          <p style="font-size: 0.85rem; color:#6b7280;">
            Tip: Reply directly to this email to continue the conversation.
          </p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully 🎉",
    });

  } catch (error) {
    console.error("Email send failed:", error);

    res.status(500).json({
      success: false,
      error: "Email service failed",
    });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Backend is alive 🚀" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
