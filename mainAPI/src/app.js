require('dotenv').config();

const express = require('express');
const { configRouter } = require('./config/config');

const PORT = process.env.PORT || 3001;
const app = express();

app.use("/config", configRouter)

app.get('/', (req, res) => {
	res.status(200).send('This seems to be working');
});

app.listen(PORT, () => {
	console.log(`Main API is running on port ${PORT}`);
});
