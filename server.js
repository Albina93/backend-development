require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(express.json());
app.use("/api/users", require("./routes/api/userRoutes"));
app.use("/api/projects", require("./routes/api/projectRoutes"));
app.use("/api/projects/:projectId/tasks", require("./routes/api/taskRoutes"));
app.use("/api/tasks", require("./routes/api/taskRoutes"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
