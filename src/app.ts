// #region Imports

//* Global Dependencies
import express, { Express } from "express";
import dotenv from "dotenv";
import { json } from "body-parser";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";

//* Project Dependencies
import { router as ninjaRoutes } from "./routes/ninja";
import { errorHandler } from "./middlewares/errors";

// #endregion

// #region Config

dotenv.config();

const app: Express = express();

// #endregion

// Middlewares
app.use(json());

// Routes (Ninjas)
app.use("/api", ninjaRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

// Error Handling
app.use(errorHandler);

app.listen(process.env.PORT || 4000, () => {
  console.log(
    `[server]: Server is running at https://localhost:${
      process.env.PORT || 4000
    }`
  );
});
