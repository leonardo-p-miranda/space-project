const express = require("express");
const bodyParser = require("body-parser");
const pilotsRoutes = require("./routes/pilots.js");
const contractsRoutes = require("./routes/contracts.js");
const resourcesRoutes = require("./routes/resources.js");
const shipsRoutes = require("./routes/ships.js");
const reportsRoutes = require("./routes/reports.js");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.use("/pilots", pilotsRoutes);
app.use("/contracts", contractsRoutes);
app.use("/resources", resourcesRoutes);
app.use("/ships", shipsRoutes);
app.use("/reports", reportsRoutes);

app.get("/", (req, res) => {
  res.send("Hello from homepage");
});

app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);
