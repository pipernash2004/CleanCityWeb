

import { Request, Response, NextFunction, RequestHandler } from "express";
import Debug from "debug";
import crypto from "crypto";
import { ctl, trace,db} from "../lib/logger";


// These keys will be masked in logs to protect sensitive data
const SENSITIVE_KEYS = ["password", "token", "authorization", "Authorization"];

/**
 * Utility: Safely mask sensitive keys in request bodies.
 * Prevents leaking secrets or tokens in logs.
 */
function maskBody(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;

  const clone: any = Array.isArray(obj) ? [] : {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    clone[key] = SENSITIVE_KEYS.includes(key.toLowerCase())
      ? "***"
      : typeof val === "object" && val !== null
      ? maskBody(val)
      : val;
  }
  return clone;
}

/**
 * Utility: Generate a short, human-readable request ID.
 * Used to correlate logs for a single request.
 */
function generateReqId(): string {
  return crypto.randomUUID().split("-")[0];
}

/**
 * Middleware: Request Tracer
 * ------------------------------------------
 * Adds a unique trace ID to every request,
 * logs inbound and outbound info,
 * and helps correlate logs across layers (controller, DB, etc.).
 */
export function tracer(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    // Attach unique ID to the request for tracking and casting to avoid mismatch typescript rubbish 
    const traceReq = req as Request & { traceId?: string ; log?: any};
    traceReq.traceId = traceReq.traceId || generateReqId();

    // creating a simple per-request logger that prefixes each message with traceId

    const base = `[${traceReq.traceId}]`;
    

    // attach a simple logger with methods
    traceReq.log = {
      info: (...args: any[]) => ctl(base, ...args),
      debug: (...args: any[]) => trace(base, ...args),
      db: (...args: any[]) => db(base, ...args),
      error: (...args: any[]) => ctl(base, ...args),
    };

    const start = Date.now();

    // Inbound log (request start)
    console.log(`→ ${ base} ${req.method} ${req.originalUrl}`);
    trace(`headers: ${JSON.stringify(req.headers)}`);
    trace(`body: ${JSON.stringify(maskBody(req.body))}`);

    // Hook into response end
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `← ${ base}  ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
      );
    });

    next();
  };
}
