import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import childRoutes from "./routes/childRoutes.js";
import screenTimeRoutes from "./routes/screenTimeRoutes.js";
import "./models/Child.js"; 
import helmet from 'helmet';
import http from 'http';
import { Server } from 'socket.io';
import socialMediaRoutes from './routes/socialMediaRoutes.js';
import appControlRoutes from './routes/appControlRoutes.js';
import contentFilterRoutes from './routes/contentFilterRoutes.js';
import proxyRoutes from './routes/proxyRoutes.js';
import callSmsRoutes from './routes/callSmsRoutes.js';


dotenv.config();
const app = express();
app.use(express.json());
const server = http.createServer(app);
export const io = new Server(server);
app.use(helmet());
app.use('/api/callsms', callSmsRoutes);
app.use('/api/app-control', appControlRoutes);
app.use('/api/proxy', proxyRoutes);
app.use('/api/content-filter', contentFilterRoutes);
app.use("/api/screen-time", screenTimeRoutes);
app.use('/api/socialmedia', socialMediaRoutes);
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
