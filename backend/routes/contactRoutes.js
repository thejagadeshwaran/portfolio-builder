const express = require("express");
const router = express.Router();

const Contact = require("../models/contact");

// =======================
// Send Contact Message
// POST /api/contact/send
// =======================
router.post("/send", async (req, res) => {
  try {

    const {
      name,
      email,
      subject,
      message,
      portfolioOwner,
      portfolio
    } = req.body;

    const contact = new Contact({
      name,
      email,
      subject,
      message,
      portfolioOwner,
      portfolio
    });

    await contact.save();

    res.status(201).json({
      message: "Message sent successfully",
      contact
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});

// =======================
// Get All Messages
// GET /api/contact/all
// =======================
router.get("/all", async (req, res) => {
  try {

    const contacts = await Contact.find()
      .populate("portfolioOwner", "name email")
      .populate("portfolio", "portfolioTitle username")
      .sort({ createdAt: -1 });

    res.status(200).json(contacts);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});

// =======================
// Delete Message
// DELETE /api/contact/:id
// =======================
router.delete("/:id", async (req, res) => {
  try {

    const contact = await Contact.findByIdAndDelete(
      req.params.id
    );

    if (!contact) {
      return res.status(404).json({
        message: "Message not found"
      });
    }

    res.status(200).json({
      message: "Message deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});

module.exports = router;