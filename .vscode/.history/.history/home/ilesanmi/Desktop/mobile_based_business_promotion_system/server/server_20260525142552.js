const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5174/",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    data: { status: "ok" },
    message: "BizPromo API is running",
  });
});

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/businesses", require("./routes/business.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/promotions", require("./routes/promotion.routes"));
app.use("/api/inquiries", require("./routes/inquiry.routes"));
app.use("/api/search", require("./routes/search.routes"));
app.use("/api/payments", require("./routes/payment.routes"));

app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, data: null, message: "Route not found" });
});
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  connectDB()
    .then(() => {
      const port = process.env.PORT || 5000;
      app.listen(port, () =>
        console.log(`BizPromo server running on port ${port}`),
      );
    })
    .catch((error) => {
      console.error("Database connection failed:", error.message);
      process.exit(1);
    });
}

module.exports = app;
