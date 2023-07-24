const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;


app.use(cors());
app.use(express.json());

// Set the routes

app.use((req, res) => {
    res.status(404).send("Not Found")
})
app.listen(port, () => {
    console.log(`server has started on port ${port}`);
})

module.exports = app;