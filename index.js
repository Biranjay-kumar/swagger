import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes.js";
import http from "http";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// OpenAPI setup
const openapiPath = path.join(__dirname, "openapi.json");
let openapiData;
try {
  openapiData = JSON.parse(fs.readFileSync(openapiPath, "utf8"));
} catch (err) {
  console.error("Error reading OpenAPI file:", err.message);
  process.exit(1);
}
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiData));

// Routes
app.use("/api", routes);

app.get("/", (req, res) => {
  res.status(200).send("Backend is up and running");
});

app.get("*", (req, res) => {
  res.status(404).send("Route not found");
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
