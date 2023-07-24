const express = require('express');
const app = express();
const cors = require('cors');
const wishesRouter = require('./routes/wishes')



app.use(cors());
app.use(express.json());


// Set the routes
app.use('/', wishesRouter);

app.use((req, res) => {
    res.status(404).send("Not Found")
})

const port = 5000;
app.listen(port, () => {
    console.log(`server has started on port ${port}`);
})

module.exports = app;