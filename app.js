const express = require('express');
const app = express();
const cors = require('cors');
const wishRouter = require('./routes/wishRoutes');
const userRouter = require('./routes/userRoutes');



app.use(cors());
app.use(express.json());


// Set the routes
app.use('/', wishRouter);
app.use('/', userRouter);

app.use((req, res) => {
    res.status(404).send("Not Found");
})

const port = 5000;
app.listen(port, () => {
    console.log(`server has started on port ${port}`);
})

module.exports = app;