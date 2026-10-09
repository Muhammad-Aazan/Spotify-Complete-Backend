const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require('dotenv').config()
const app = require("./src/app");
const connectDB = require('./src/db/db');

const PORT = 3000;

connectDB()

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
})