import express, { type Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database";
import { ctl, db,  showActiveDebuggers } from "./lib/logger";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { tracer } from "./middleware/trace";
;
dotenv.config({ path: "server/.env" });

const app = express();

// Middleware/////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(cors());
app.use(express.json({
  verify: (req, _res, buf) => {
    (req as any).rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));
app.use(tracer());

//////////////////////////////////////////////////////////////////////////////////////////////////////////

// Start server
async function startServer() {
  try {
    await connectDatabase();

    if (db.enabled) {
      mongoose.set("debug", (collectionName: string, method: string, ...args: any[]) => {
        db(`${collectionName}.${method}`, JSON.stringify(args));
      });
    }

    const server = await registerRoutes(app);

    app.use((_req: Request, res: Response) => {
      res.status(404).json({ message: "Route not found" });
    });

    app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
      const reqId = (req as any).traceId || "unknown";
      ctl(`[${reqId}] Error: ${err.message}`);
      res.status(500).json({ error: err.message });
    });

    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const port = parseInt(process.env.PORT || "5000", 10);
    showActiveDebuggers();
    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

  } catch (error) {
    console.log("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
