import express, { Application } from "express";
import sequelize from "./config/database";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import itemRoutes from "./routes/itemRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import Interceptor from "./interceptors/responseInterceptor";
import ExceptionCatcher from "./catchers/httpExceptionCatcher";

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(Interceptor);

app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/invoices", invoiceRoutes);

// custom get request to test the exception handler
app.get("/error", (req, res, next) => {
  throw new Error("This is a custom error message");
});

app.use(ExceptionCatcher);

sequelize
  .authenticate()
  .then(() => {
    sequelize.sync().then(() => {
      console.log("DB connection successfull");
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database: ", err.message);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
