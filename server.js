import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import childRoutes from "./routes/childRoutes.js";
import screenTimeRoutes from "./routes/screenTimeRoutes.js";
import "./models/Child.js"; // Assure-toi que le modèle est chargé



dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/screen-time", screenTimeRoutes);
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/children", childRoutes);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connecté"))
    .catch((err) => console.error("Erreur de connexion à MongoDB :", err));

app.get("/", (req, res) => {
    res.send("API Kidcare est en ligne !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
