import app from "./app.js";
import { connectDB } from "./config/db.config.js";
import logger from "./config/logger.config.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

let server: ReturnType<typeof app.listen> | undefined;

// Starts the server after successful DB connection.
async function startServer() {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      logger.info(
        `🚀 Server started and listening at http://localhost:${PORT}`
      );
    });

    // Graceful shutdown on SIGINT/SIGTERM -> Know more about these
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err: any) {
    logger.error(`❌ Unable to start server: ${err.message}`);
    process.exit(1);
  }
}

// Gracefully shuts down the server and exits the process.
function shutdown() {
  logger.info("Received exit signal. Closing server gracefully...");
  if (server) {
    server.close(() => {
      logger.info("Server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

// Start everything
startServer();
