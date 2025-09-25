import express from "express"
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js"
import notesRoutes from "./routes/notes.routes.js"
import path from "path"
import { fileURLToPath } from "url";
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.use("/api/users" , authRoutes)
app.use("/api/notes" , notesRoutes)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"))
  );
}

connectDB();

app.listen(port , (req , res) => {
  console.log(`Server Listening at http://localhost:${port}`)
})