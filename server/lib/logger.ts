/**
 * Centralized Logger Utility
 *
 * Architecture Rationale:
 * - Keeps all logging namespaces consistent
 * - Allows easy filtering using DEBUG env variable
 * - Enables structured, traceable logs across the system
 *
 * Example:
 *   DEBUG=server:* npm run dev        → shows all logs
 *   DEBUG=server:ctl npm run dev      → controllers only
 *   DEBUG=server:db npm run dev       → database only
 *   DEBUG=server:trace npm run dev    → middleware traces
 */

import Debug from "debug";

/**
 * Core namespaces by system concern
 *
 * server:ctl   → Controllers (business logic)
 * server:trace → Middleware, request tracing
 * server:db    → Database operations
 * server:init  → Startup, config loading
 */
export const ctl = Debug("server:ctl");
ctl.log = console.log.bind(console);

export const trace = Debug("server:trace");
trace.log = console.log.bind(console);

export const db = Debug("server:db");
db.log = console.log.bind(console);


/**
 * Factory function: create a custom debug logger.
 *
 * Useful when you want to create per-request or per-module loggers dynamically.
 */
type LogFn = (...args: unknown[]) => void; // 👈 safer and fixes the spread issue

export function makeDebug(ns: string) {
  // Explicitly assert the type of dbg so TypeScript knows it supports spread args
  const dbg = Debug(ns) as LogFn;

  return {
    debug: (...args: unknown[]) => dbg(...args),
    info: (...args: unknown[]) => dbg(...args),
    warn: (...args: unknown[]) => dbg(...args),
    error: (...args: unknown[]) => dbg(...args),
  };
}

/**
 * Optional helper — quick info message on startup.
 *
 * Logs active debug namespaces, so you know what’s running.
 */
export function showActiveDebuggers() {
  const active = process.env.DEBUG || "none";
  console.log(`🔍 Debug active for namespaces: ${active}`);
}
