import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";
const prettyLogs = !isProduction && process.env.VITEST !== "true";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "req.headers['x-conversation-token']",
    "res.headers['set-cookie']",
  ],
  ...(prettyLogs
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }
    : {}),
});
