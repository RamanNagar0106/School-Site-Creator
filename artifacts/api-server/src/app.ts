import express, { Request, Response } from "express";
import pinoHttp from "pino-http";

const app = express();

// Fix pino-http error
app.use((pinoHttp as any)());

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Backend running 🚀");
});

app.get("/api/products", (req: Request, res: Response) => {
  res.json([{ id: 1, name: "3D Product Demo" }]);
});

export default app;
