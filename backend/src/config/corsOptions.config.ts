import originCheck from "../utils/originCheck.js";

const isProduction = process.env.NODE_ENV === "production";

const corsOptions = {
  origin: originCheck,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: isProduction ? 7200 : 600, // Preflight cache duration (seconds)
  optionsSuccessStatus: 200,
};

export default corsOptions;
