import { Router } from "express";
import type { Request, Response } from "express";
import { sendContactFormSubmission } from "../lib/email";
import { logger } from "../lib/logger";

const router = Router();

// POST /contact
router.post("/contact", async (req: Request, res: Response): Promise<void> => {
  const { name, email, subject, message } = req.body as {
    name?: unknown;
    email?: unknown;
    subject?: unknown;
    message?: unknown;
  };

  if (typeof name !== "string" || !name.trim()) {
    res.status(400).json({ error: "Name is required" });
    return;
  }
  if (typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "A valid email address is required" });
    return;
  }
  if (typeof subject !== "string" || !subject.trim()) {
    res.status(400).json({ error: "Subject is required" });
    return;
  }
  if (typeof message !== "string" || message.trim().length < 10) {
    res.status(400).json({ error: "Message must be at least 10 characters" });
    return;
  }

  try {
    await sendContactFormSubmission({
      name: name.trim().slice(0, 200),
      email: email.trim().slice(0, 200),
      subject: subject.trim().slice(0, 200),
      message: message.trim().slice(0, 5000),
    });
    logger.info({ email }, "Contact form submitted");
    res.json({ success: true, message: "Your message has been sent. We'll get back to you within 1 business day." });
  } catch (err) {
    logger.error({ err }, "Contact form submission error");
    res.status(500).json({ error: "Failed to send your message. Please try again or email us directly." });
  }
});

export default router;
