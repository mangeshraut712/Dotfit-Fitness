import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import { pinoHttp } from "pino-http";
import router from "./routes";
import { clientErrorMessage, clientErrorStatus } from "./lib/http-error";
import { logger } from "./lib/logger";

const app: Express = express();

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  // One hop (Replit / a reverse proxy) so rate limits see the visitor IP.
  app.set("trust proxy", 1);
}

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (isProduction) {
    res.setHeader("Strict-Transport-Security", "max-age=15552000; includeSubDomains");
  }
  next();
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(
  cors({
    origin: isProduction
      ? ["https://dotfitfitness.in", "https://www.dotfitfitness.in"]
      : ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept", "Authorization", "X-Conversation-Token"],
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api", router);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const status = clientErrorStatus(err);
  if (status) {
    res.status(status).json({ error: clientErrorMessage(status) });
    return;
  }
  logger.error({ err }, "Unhandled application error");
  res.status(500).json({ error: "Internal server error" });
});

export default app;
