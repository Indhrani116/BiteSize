require("dotenv").config();
const authRoutes = require("./routes/auth");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const postRoutes = require("./routes/posts");
const geminiRoutes = require("./routes/gemini");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/gemini", geminiRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "BiteSize API is running!"
    });
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
    });