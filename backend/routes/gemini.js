const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const ai = new GoogleGenAI({});

router.post("/explain", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        message: "Content is required"
      });
    }

    const prompt = `
Explain the following educational concept like I'm 5 years old.

Use:
- Very simple English
- A small real-life example
- Short sentences
- Avoid difficult technical words

Concept:
${content}
`;

    const response = await ai.models.generateContent({
   model: "gemini-3.5-flash-lite",
      contents: prompt
    });

    res.json({
      explanation: response.text
    });

  } catch (error) {
    console.error("Gemini error:", error);

    res.status(500).json({
      message: "Failed to generate explanation"
    });
  }
});

module.exports = router;