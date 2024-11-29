import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./db/config.js";

dotenv.config({
  path: ".env",
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Application is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error", error);
  });

const PORT = process.env.PORT || 8001;
