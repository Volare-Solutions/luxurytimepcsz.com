// api/submit-form.js
import { Client } from "pg";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  const { firstName, lastName, email, contactNumber, message, pieceID } =
    req.body;

  try {
    // Send email to management with lead's information
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // use SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let mailOptions = {
      from: '"LuxuryTimePCSZ" <zerodeductible74@gmail.com>', // sender address
      to: "graysoncrozier40@gmail.com", // godleads444@gmail.com real
      subject: "New Lead Submission",
      text: `New lead submission received:\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${contactNumber}\Message: ${message}\nPiece ID: ${pieceID}`, // plain text body
      html: `<p>New lead submission received:</p><ul><li><strong>Name:</strong> ${firstName} ${lastName}</li><li><strong>Email:</strong> ${email}</li><li><strong>Phone:</strong> ${contactNumber}</li><li><strong>Message:</strong> ${message}</li><li><strong>Piece ID:</strong> ${pieceID}</li></ul>`, // html body
    };

    await client.query(
      "INSERT INTO leads (first_name, last_name, email, contact_number, message) VALUES ($1, $2, $3, $4, $5)",
      [firstName, lastName, email, contactNumber, message]
    );

    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    res.status(200).json({ status: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.end();
  }
};
