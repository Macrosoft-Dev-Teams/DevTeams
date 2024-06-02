require('dotenv').config();

const express = require('express');
const { configRouter } = require('./src/config/config');
const { teamsRouter } = require('./src/teams/teams.router');
const { chatsRouter } = require('./src/chats/chats.router');
const { auth } = require('./src/auth');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());

app.use('/config', configRouter);

app.use(auth);
app.use('/teams', teamsRouter);
app.use('/chats', chatsRouter);

app.get('/', (req, res) => {
	res.status(200).send('This seems to be working');
});

app.listen(PORT, () => {
	console.log(`Main API is running on port ${PORT}`);
});
